"""
Pydantic models for DakDash API
Type-safe request/response schemas
"""

from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class TrackingEvent(BaseModel):
    """Individual tracking event in the shipment timeline"""
    location: str = Field(..., description="Event location or hub")
    status: str = Field(..., description="Status description")
    timestamp: str = Field(..., description="ISO 8601 timestamp")
    
    class Config:
        json_schema_extra = {
            "example": {
                "location": "New Delhi GPO",
                "status": "Item dispatched",
                "timestamp": "2026-01-28T10:30:00Z"
            }
        }


class TrackingResponse(BaseModel):
    """Normalized tracking response for frontend consumption"""
    tracking_number: str = Field(..., description="Consignment/tracking number")
    carrier: str = Field(default="India Post", description="Carrier name")
    status: str = Field(..., description="Current delivery status")
    origin: str = Field(default="", description="Origin location")
    destination: str = Field(default="", description="Destination address")
    last_updated: str = Field(..., description="Last update timestamp")
    events: List[TrackingEvent] = Field(
        default_factory=list,
        description="Chronological list of tracking events"
    )
    delay_info: Optional[dict] = Field(
        default=None,
        description="Phase 2: Delay detection information with status, severity, and hours_since_update"
    )
    smart_summary: Optional[str] = Field(
        default=None,
        description="Phase 2: AI-generated natural language summary of shipment status"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "tracking_number": "RM123456789IN",
                "carrier": "India Post",
                "status": "In Transit",
                "origin": "Mumbai",
                "destination": "New Delhi",
                "last_updated": "2026-01-28T15:45:00Z",
                "events": [
                    {
                        "location": "New Delhi GPO",
                        "status": "Out for delivery",
                        "timestamp": "2026-01-28T08:00:00Z"
                    },
                    {
                        "location": "Delhi Sorting Hub",
                        "status": "Item arrived at hub",
                        "timestamp": "2026-01-27T22:30:00Z"
                    }
                ],
                "delay_info": {
                    "status": "on_track",
                    "severity": "none",
                    "message": "Package is progressing normally",
                    "hours_since_update": 7
                },
                "smart_summary": "Your parcel is on track and progressing normally through the delivery network. Last seen at New Delhi GPO and currently out for delivery."
            }
        }


class ErrorResponse(BaseModel):
    """Standard error response"""
    error: bool = True
    message: str
    tracking_number: Optional[str] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "error": True,
                "message": "Tracking number not found",
                "tracking_number": "INVALID123"
            }
        }
