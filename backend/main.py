"""
DakDash Backend - India Post Tracking API
FastAPI application for tracking India Post consignments via TrackingMore API
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import httpx
import os
import json
from typing import Optional
from datetime import datetime

from models import TrackingResponse, TrackingEvent
from config import settings
from delay_detection import detect_delay, generate_smart_summary

app = FastAPI(
    title="DakDash API",
    description="Track India Post consignments powered by TrackingMore",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "service": "DakDash API",
        "status": "running",
        "version": "1.0.0"
    }


@app.get("/api/carriers")
async def get_supported_carriers():
    """
    Get list of supported carriers
    
    Returns:
        List of carrier objects with code and name
    """
    carriers = [
        {"code": "india-post", "name": "India Post", "icon": "🇮🇳"},
        {"code": "delhivery", "name": "Delhivery", "icon": "📦"},
        {"code": "bluedart", "name": "Blue Dart", "icon": "✈️"},
        {"code": "dtdc", "name": "DTDC", "icon": "🚚"},
        {"code": "ecom-express", "name": "Ecom Express", "icon": "🛒"},
        {"code": "ekart", "name": "Ekart Logistics", "icon": "🎯"},
    ]
    return {"carriers": carriers}


@app.get("/api/track/DEMO", response_model=TrackingResponse)
async def track_demo():
    """
    Demo endpoint with example data showcasing all Phase 2 features
    Use tracking number 'DEMO' to see this example
    """
    from datetime import datetime, timedelta
    
    # Create events with realistic timeline
    now = datetime.now()
    events = [
        TrackingEvent(
            location="Mumbai Sorting Center - Package received",
            status="In Transit",
            timestamp=(now - timedelta(days=5)).isoformat()
        ),
        TrackingEvent(
            location="Mumbai Central - Dispatched to Delhi",
            status="In Transit",
            timestamp=(now - timedelta(days=4, hours=18)).isoformat()
        ),
        TrackingEvent(
            location="Delhi Regional Hub - Arrived",
            status="In Transit",
            timestamp=(now - timedelta(days=3, hours=12)).isoformat()
        ),
        TrackingEvent(
            location="Delhi Sorting Center - Processing",
            status="In Transit",
            timestamp=(now - timedelta(days=3, hours=6)).isoformat()
        ),
        # Last update was 3 days ago - triggers delay detection
    ]
    
    response_dict = {
        "tracking_number": "DEMO12345IN",
        "carrier": "India Post",
        "status": "In Transit",
        "origin": "Mumbai, Maharashtra",
        "destination": "Delhi, NCR",
        "last_updated": (now - timedelta(days=3, hours=6)).isoformat(),
        "events": [e.dict() for e in events],
        # Phase 2 Features
        "delay_info": {
            "status": "delayed",
            "severity": "moderate",
            "message": "Package hasn't been updated in 3 days",
            "hours_since_update": 78
        },
        "smart_summary": "Your parcel hasn't been updated in 3 days. There might be a slight delay in transit. The package was last seen at Delhi Sorting Center and is currently being processed for final delivery."
    }
    
    return response_dict


@app.get("/api/track/{tracking_number}", response_model=TrackingResponse)
async def track_consignment(tracking_number: str, carrier: str = "india-post"):
    """
    Track consignment using TrackingMore API
    
    Args:
        tracking_number: Tracking/consignment number
        carrier: Carrier code (india-post, delhivery, bluedart, dtdc, ecom-express)
        
    Returns:
        Normalized tracking information with events timeline
    """
    
    # Validate tracking number format
    if not tracking_number or len(tracking_number) < 8:
        raise HTTPException(
            status_code=400,
            detail="Invalid tracking number format"
        )
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            headers = {
                "Tracking-Api-Key": settings.TRACKINGMORE_API_KEY,
                "Content-Type": "application/json"
            }
            
            # Normalize carrier code
            carrier_code = carrier.lower()
            
            # Step 1: Create/Register the tracking number (if not exists)
            create_url = "https://api.trackingmore.com/v4/trackings/create"
            create_payload = {
                "tracking_number": tracking_number,
                "courier_code": carrier_code
            }
            
            # Try to create the tracking (ignore if already exists)
            create_response = await client.post(create_url, json=create_payload, headers=headers)
            
            # Step 2: Get the tracking information
            # Wait a moment for the tracking to be processed
            import asyncio
            await asyncio.sleep(2)
            
            # Use GET endpoint with query parameters
            get_url = "https://api.trackingmore.com/v4/trackings/get"
            get_params = {
                "tracking_numbers": tracking_number,
                "courier_code": carrier_code
            }
            
            response = await client.get(get_url, params=get_params, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                
                # Check if tracking data exists
                if data.get("meta", {}).get("code") == 200 and data.get("data"):
                    tracking_list = data.get("data", [])
                    
                    if tracking_list and len(tracking_list) > 0:
                        tracking_data = tracking_list[0]
                        
                        # Normalize response
                        normalized_response = normalize_tracking_data(
                            tracking_number,
                            tracking_data
                        )
                        
                        # Add delay detection
                        delay_info = detect_delay(tracking_data, normalized_response.events)
                        smart_summary = generate_smart_summary(
                            tracking_data, 
                            [e.dict() for e in normalized_response.events],
                            delay_info
                        )
                        
                        # Add to response as additional fields
                        response_dict = normalized_response.dict()
                        response_dict["delay_info"] = delay_info
                        response_dict["smart_summary"] = smart_summary
                        
                        return response_dict
                    else:
                        raise HTTPException(
                            status_code=404,
                            detail="No tracking data available yet. The carrier may still be processing this shipment."
                        )
                else:
                    error_msg = data.get("meta", {}).get("message", "Unknown error")
                    raise HTTPException(
                        status_code=404,
                        detail=f"Tracking information not found: {error_msg}"
                    )
            
            elif response.status_code == 401:
                raise HTTPException(
                    status_code=500,
                    detail="API authentication failed"
                )
            
            elif response.status_code == 404:
                raise HTTPException(
                    status_code=404,
                    detail="Tracking number not found"
                )
            
            else:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"External API error: {response.text}"
                )
                
    except httpx.TimeoutException:
        raise HTTPException(
            status_code=504,
            detail="Tracking service timeout. Please try again."
        )
    
    except httpx.RequestError as e:
        raise HTTPException(
            status_code=503,
            detail=f"Unable to connect to tracking service: {str(e)}"
        )
    
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )


def normalize_tracking_data(tracking_number: str, data: dict) -> TrackingResponse:
    """
    Normalize TrackingMore API response into clean frontend-friendly schema
    
    Args:
        tracking_number: Tracking number
        data: Raw API response data
        
    Returns:
        Normalized TrackingResponse object
    """
    
    # Extract tracking events from origin_info.trackinfo
    events = []
    origin_info = data.get("origin_info", {})
    
    if origin_info and origin_info.get("trackinfo"):
        for event in origin_info["trackinfo"]:
            # Extract event details
            detail = event.get("tracking_detail", "") or event.get("Details", "")
            checkpoint = event.get("checkpoint_status", "") or event.get("StatusDescription", "")
            date = event.get("checkpoint_date", "") or event.get("Date", "")
            
            # Get the actual location (office name) - THIS IS THE KEY FIELD!
            office_location = event.get("location", "")
            
            # Build comprehensive location string
            # Priority: Use "location" field (office name) + "tracking_detail" (status description)
            if office_location and detail:
                # Combine office location with status detail
                location = f"{office_location} - {detail}"
            elif office_location:
                # Just office location if no detail
                location = office_location
            elif detail:
                # Fallback to just detail if no office location
                location = detail
            else:
                location = "Unknown location"
            
            if location or checkpoint:  # Only add if we have some data
                events.append(TrackingEvent(
                    location=location,
                    status=checkpoint,
                    timestamp=date
                ))
    
    # Sort events by timestamp (most recent first)
    try:
        events.sort(
            key=lambda x: datetime.fromisoformat(x.timestamp.replace("Z", "+00:00")) if x.timestamp else datetime.min,
            reverse=True
        )
    except:
        # If sorting fails, keep original order
        pass
    
    # Determine overall status
    status = data.get("delivery_status", "") or data.get("substatus", "unknown")
    
    # Map status to friendly names
    status_map = {
        "delivered": "Delivered",
        "transit": "In Transit",
        "pickup": "Ready for Pickup",
        "exception": "Exception",
        "expired": "Expired",
        "pending": "Pending",
        "notfound": "Not Found",
        "infotreceived": "Info Received",
        "inforeceived": "Info Received"
    }
    
    friendly_status = status_map.get(status.lower(), status.title() if status else "Unknown")
    
    # Extract origin and destination with better location parsing
    origin = ""
    destination = ""
    
    # Get origin from multiple sources
    origin_info_data = data.get("origin_info", {})
    if origin_info_data:
        # Try country_name + postal_code
        origin_country = origin_info_data.get("country_name", "")
        origin_postal = origin_info_data.get("postal_code", "")
        if origin_postal:
            origin = f"{origin_postal}, {origin_country}" if origin_country else origin_postal
        elif origin_country:
            origin = origin_country
    
    # If no origin yet, try first event (oldest event is at the end after sort)
    if not origin and events:
        origin = events[-1].location
    
    # Get destination from multiple sources
    destination_info_data = data.get("destination_info", {})
    if destination_info_data:
        # Try structured address fields first
        recipient_city = destination_info_data.get("recipient_city", "")
        recipient_state = destination_info_data.get("recipient_state", "")
        recipient_postal = destination_info_data.get("recipient_postal", "")
        recipient_address = destination_info_data.get("recipient_address", "")
        
        # Build destination from available parts
        dest_parts = []
        if recipient_city:
            dest_parts.append(recipient_city)
        if recipient_state and recipient_state != recipient_city:
            dest_parts.append(recipient_state)
        if recipient_postal:
            dest_parts.append(recipient_postal)
        
        if dest_parts:
            destination = ", ".join(dest_parts)
        elif recipient_address:
            destination = recipient_address
    
    # If no destination yet and package is delivered, use last event location
    if not destination and events and friendly_status.lower() == "delivered":
        destination = events[0].location  # First in sorted list (most recent)
    
    # Last updated timestamp
    last_updated = data.get("update_date", "") or data.get("updated_at", "")
    
    return TrackingResponse(
        tracking_number=tracking_number,
        carrier="India Post",
        status=friendly_status,
        origin=origin,
        destination=destination,
        last_updated=last_updated,
        events=events
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Custom exception handler for better error responses"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": True,
            "message": exc.detail,
            "tracking_number": None
        }
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
