"""
Delay detection utilities for DakDash
Rule-based system to identify shipment delays
"""

from datetime import datetime, timedelta
from typing import Dict, List, Optional


def detect_delay(tracking_data: dict, events: List[dict]) -> Dict[str, any]:
    """
    Detect if a shipment is delayed based on rule-based logic
    
    Args:
        tracking_data: Raw tracking data from API
        events: List of tracking events
        
    Returns:
        Dictionary with delay status and details
    """
    
    # Default response
    delay_info = {
        "status": "Normal",
        "severity": "none",
        "message": "Shipment is progressing normally",
        "hours_since_update": 0
    }
    
    # Get current delivery status
    delivery_status = tracking_data.get("delivery_status", "").lower()
    
    # If delivered, no delay
    if delivery_status == "delivered":
        delay_info["message"] = "Shipment has been delivered"
        return delay_info
    
    # Get last update timestamp
    last_update = tracking_data.get("update_at") or tracking_data.get("latest_checkpoint_time")
    
    if not last_update:
        delay_info["status"] = "Unknown"
        delay_info["message"] = "No tracking updates available yet"
        return delay_info
    
    try:
        # Parse last update time
        last_update_dt = datetime.fromisoformat(last_update.replace("Z", "+00:00"))
        current_time = datetime.now(last_update_dt.tzinfo)
        time_diff = current_time - last_update_dt
        hours_since_update = time_diff.total_seconds() / 3600
        
        delay_info["hours_since_update"] = round(hours_since_update, 1)
        
        # Check for delays based on time thresholds
        if delivery_status == "pending" and hours_since_update > 24:
            # Pending for more than 24 hours
            delay_info["status"] = "Possible Delay"
            delay_info["severity"] = "low"
            delay_info["message"] = f"No movement detected for {int(hours_since_update)} hours. Shipment may still be awaiting pickup."
            
        elif hours_since_update > 72:
            # No update for more than 72 hours (3 days)
            delay_info["status"] = "Delayed"
            delay_info["severity"] = "high"
            delay_info["message"] = f"Shipment has not moved for {int(hours_since_update)} hours. This is unusual and may indicate a delay."
            
        elif hours_since_update > 48:
            # No update for more than 48 hours (2 days)
            delay_info["status"] = "Possible Delay"
            delay_info["severity"] = "medium"
            delay_info["message"] = f"No updates for {int(hours_since_update)} hours. Shipment may be delayed at a sorting facility."
        
        # Check for stuck at same location
        if events and len(events) >= 2:
            last_location = events[0].get("location", "")
            second_last_location = events[1].get("location", "")
            
            if last_location and last_location == second_last_location and hours_since_update > 36:
                delay_info["status"] = "Delayed"
                delay_info["severity"] = "high"
                delay_info["message"] = f"Shipment stuck at {last_location} for {int(hours_since_update)} hours."
        
        # Check for exception status
        if delivery_status in ["exception", "alert", "undelivered"]:
            delay_info["status"] = "Exception"
            delay_info["severity"] = "high"
            delay_info["message"] = "Shipment encountered an exception. Please contact India Post for details."
            
    except Exception as e:
        print(f"Error in delay detection: {str(e)}")
    
    return delay_info


def generate_smart_summary(tracking_data: dict, events: List[dict], delay_info: dict) -> str:
    """
    Generate a user-friendly natural language summary of shipment status
    
    Args:
        tracking_data: Raw tracking data
        events: List of tracking events
        delay_info: Delay detection results
        
    Returns:
        Human-readable summary string
    """
    
    delivery_status = tracking_data.get("delivery_status", "").lower()
    
    # Delivered status
    if delivery_status == "delivered":
        return "🎉 Great news! Your parcel has been delivered successfully."
    
    # Exception/Alert status
    if delivery_status in ["exception", "alert", "undelivered"]:
        return "⚠️ Your shipment has encountered an issue. Please contact India Post customer service for assistance."
    
    # Get latest event
    if events and len(events) > 0:
        latest_event = events[0]
        location = latest_event.get("location", "")
        status = latest_event.get("status", "")
        
        # Build summary based on status
        if delivery_status == "transit" or "transit" in status.lower():
            if delay_info["status"] == "Delayed":
                return f"⏸️ Your parcel is currently at {location}, but hasn't moved for {int(delay_info['hours_since_update'])} hours. Expect possible delays."
            else:
                return f"📦 Your parcel is in transit. Last location: {location}. Delivery expected soon."
        
        elif "out for delivery" in status.lower() or delivery_status == "pickup":
            return f"🚚 Excellent! Your parcel is out for delivery from {location}. You should receive it today."
        
        elif "pickup" in status.lower() or delivery_status == "pickup":
            return f"📬 Your parcel is ready for pickup at {location}. Please collect it at your convenience."
        
        elif delivery_status == "pending" or "booked" in status.lower():
            if delay_info["hours_since_update"] > 24:
                return f"⏳ Your parcel was registered at {location} but hasn't started moving yet. This may take 24-48 hours."
            else:
                return f"✅ Your parcel has been booked at {location} and will begin its journey soon."
    
    # Default summary
    if delivery_status == "pending":
        return "⏳ Your tracking number is registered. Waiting for India Post to scan and dispatch the parcel."
    
    return "📦 Your parcel is being processed. Check back soon for detailed updates."
