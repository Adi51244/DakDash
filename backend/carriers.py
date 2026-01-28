"""
Carrier Service Factory
Abstraction layer for supporting multiple carriers
"""

from typing import Protocol, Dict, Any
from abc import ABC, abstractmethod


class CarrierService(ABC):
    """Abstract base class for carrier services"""
    
    @abstractmethod
    async def create_tracking(self, tracking_number: str) -> Dict[str, Any]:
        """Register tracking number with carrier"""
        pass
    
    @abstractmethod
    async def get_tracking(self, tracking_number: str) -> Dict[str, Any]:
        """Fetch tracking data from carrier"""
        pass
    
    @abstractmethod
    def normalize_data(self, raw_data: dict) -> dict:
        """Normalize carrier-specific data to standard format"""
        pass
    
    @property
    @abstractmethod
    def carrier_name(self) -> str:
        """Return carrier name"""
        pass


class IndiaPostService(CarrierService):
    """India Post carrier service implementation"""
    
    def __init__(self, api_client, api_key: str):
        self.client = api_client
        self.api_key = api_key
        self._carrier_code = "india-post"
        self._carrier_name = "India Post"
    
    async def create_tracking(self, tracking_number: str) -> Dict[str, Any]:
        """Register tracking with TrackingMore for India Post"""
        headers = {
            "Tracking-Api-Key": self.api_key,
            "Content-Type": "application/json"
        }
        
        url = "https://api.trackingmore.com/v4/trackings/create"
        payload = {
            "tracking_number": tracking_number,
            "courier_code": self._carrier_code
        }
        
        response = await self.client.post(url, json=payload, headers=headers)
        return response
    
    async def get_tracking(self, tracking_number: str) -> Dict[str, Any]:
        """Fetch tracking data for India Post"""
        headers = {
            "Tracking-Api-Key": self.api_key,
            "Content-Type": "application/json"
        }
        
        url = "https://api.trackingmore.com/v4/trackings/get"
        params = {
            "tracking_numbers": tracking_number,
            "courier_code": self._carrier_code
        }
        
        response = await self.client.get(url, params=params, headers=headers)
        return response
    
    def normalize_data(self, raw_data: dict) -> dict:
        """Normalize India Post data"""
        # Extract events
        events = []
        origin_info = raw_data.get("origin_info", {})
        
        if origin_info and origin_info.get("trackinfo"):
            for event in origin_info["trackinfo"]:
                detail = event.get("tracking_detail", "") or event.get("Details", "Unknown location")
                checkpoint = event.get("checkpoint_status", "") or event.get("StatusDescription", "")
                date = event.get("checkpoint_date", "") or event.get("Date", "")
                
                if detail or checkpoint:
                    events.append({
                        "location": detail,
                        "status": checkpoint,
                        "timestamp": date
                    })
        
        # Determine status
        status = raw_data.get("delivery_status", "") or raw_data.get("substatus", "unknown")
        
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
        
        # Extract locations
        origin = events[-1]["location"] if events else ""
        destination = raw_data.get("destination_info", {}).get("recipient_address", "")
        
        # Last updated
        last_updated = raw_data.get("update_at", "") or raw_data.get("updated_at", "")
        
        return {
            "carrier": self._carrier_name,
            "status": friendly_status,
            "origin": origin,
            "destination": destination,
            "last_updated": last_updated,
            "events": events
        }
    
    @property
    def carrier_name(self) -> str:
        return self._carrier_name


class DelhiveryService(CarrierService):
    """Delhivery carrier service implementation"""
    
    def __init__(self, api_client, api_key: str):
        self.client = api_client
        self.api_key = api_key
        self._carrier_code = "delhivery"
        self._carrier_name = "Delhivery"
    
    async def create_tracking(self, tracking_number: str) -> Dict[str, Any]:
        """Register tracking with TrackingMore for Delhivery"""
        headers = {
            "Tracking-Api-Key": self.api_key,
            "Content-Type": "application/json"
        }
        
        url = "https://api.trackingmore.com/v4/trackings/create"
        payload = {
            "tracking_number": tracking_number,
            "courier_code": self._carrier_code
        }
        
        response = await self.client.post(url, json=payload, headers=headers)
        return response
    
    async def get_tracking(self, tracking_number: str) -> Dict[str, Any]:
        """Fetch tracking data for Delhivery"""
        headers = {
            "Tracking-Api-Key": self.api_key,
            "Content-Type": "application/json"
        }
        
        url = "https://api.trackingmore.com/v4/trackings/get"
        params = {
            "tracking_numbers": tracking_number,
            "courier_code": self._carrier_code
        }
        
        response = await self.client.get(url, params=params, headers=headers)
        return response
    
    def normalize_data(self, raw_data: dict) -> dict:
        """Normalize Delhivery data"""
        events = []
        origin_info = raw_data.get("origin_info", {})
        
        if origin_info and origin_info.get("trackinfo"):
            for event in origin_info["trackinfo"]:
                detail = event.get("tracking_detail", "") or event.get("Details", "Unknown location")
                checkpoint = event.get("checkpoint_status", "") or event.get("StatusDescription", "")
                date = event.get("checkpoint_date", "") or event.get("Date", "")
                
                if detail or checkpoint:
                    events.append({
                        "location": detail,
                        "status": checkpoint,
                        "timestamp": date
                    })
        
        status = raw_data.get("delivery_status", "") or raw_data.get("substatus", "unknown")
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
        origin = events[-1]["location"] if events else ""
        destination = raw_data.get("destination_info", {}).get("recipient_address", "")
        last_updated = raw_data.get("update_at", "") or raw_data.get("updated_at", "")
        
        return {
            "carrier": self._carrier_name,
            "status": friendly_status,
            "origin": origin,
            "destination": destination,
            "last_updated": last_updated,
            "events": events
        }
    
    @property
    def carrier_name(self) -> str:
        return self._carrier_name


class BlueDartService(CarrierService):
    """Blue Dart carrier service implementation"""
    
    def __init__(self, api_client, api_key: str):
        self.client = api_client
        self.api_key = api_key
        self._carrier_code = "bluedart"
        self._carrier_name = "Blue Dart"
    
    async def create_tracking(self, tracking_number: str) -> Dict[str, Any]:
        """Register tracking with TrackingMore for Blue Dart"""
        headers = {
            "Tracking-Api-Key": self.api_key,
            "Content-Type": "application/json"
        }
        
        url = "https://api.trackingmore.com/v4/trackings/create"
        payload = {
            "tracking_number": tracking_number,
            "courier_code": self._carrier_code
        }
        
        response = await self.client.post(url, json=payload, headers=headers)
        return response
    
    async def get_tracking(self, tracking_number: str) -> Dict[str, Any]:
        """Fetch tracking data for Blue Dart"""
        headers = {
            "Tracking-Api-Key": self.api_key,
            "Content-Type": "application/json"
        }
        
        url = "https://api.trackingmore.com/v4/trackings/get"
        params = {
            "tracking_numbers": tracking_number,
            "courier_code": self._carrier_code
        }
        
        response = await self.client.get(url, params=params, headers=headers)
        return response
    
    def normalize_data(self, raw_data: dict) -> dict:
        """Normalize Blue Dart data"""
        events = []
        origin_info = raw_data.get("origin_info", {})
        
        if origin_info and origin_info.get("trackinfo"):
            for event in origin_info["trackinfo"]:
                detail = event.get("tracking_detail", "") or event.get("Details", "Unknown location")
                checkpoint = event.get("checkpoint_status", "") or event.get("StatusDescription", "")
                date = event.get("checkpoint_date", "") or event.get("Date", "")
                
                if detail or checkpoint:
                    events.append({
                        "location": detail,
                        "status": checkpoint,
                        "timestamp": date
                    })
        
        status = raw_data.get("delivery_status", "") or raw_data.get("substatus", "unknown")
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
        origin = events[-1]["location"] if events else ""
        destination = raw_data.get("destination_info", {}).get("recipient_address", "")
        last_updated = raw_data.get("update_at", "") or raw_data.get("updated_at", "")
        
        return {
            "carrier": self._carrier_name,
            "status": friendly_status,
            "origin": origin,
            "destination": destination,
            "last_updated": last_updated,
            "events": events
        }
    
    @property
    def carrier_name(self) -> str:
        return self._carrier_name


class DTDCService(CarrierService):
    """DTDC carrier service implementation"""
    
    def __init__(self, api_client, api_key: str):
        self.client = api_client
        self.api_key = api_key
        self._carrier_code = "dtdc"
        self._carrier_name = "DTDC"
    
    async def create_tracking(self, tracking_number: str) -> Dict[str, Any]:
        """Register tracking with TrackingMore for DTDC"""
        headers = {
            "Tracking-Api-Key": self.api_key,
            "Content-Type": "application/json"
        }
        
        url = "https://api.trackingmore.com/v4/trackings/create"
        payload = {
            "tracking_number": tracking_number,
            "courier_code": self._carrier_code
        }
        
        response = await self.client.post(url, json=payload, headers=headers)
        return response
    
    async def get_tracking(self, tracking_number: str) -> Dict[str, Any]:
        """Fetch tracking data for DTDC"""
        headers = {
            "Tracking-Api-Key": self.api_key,
            "Content-Type": "application/json"
        }
        
        url = "https://api.trackingmore.com/v4/trackings/get"
        params = {
            "tracking_numbers": tracking_number,
            "courier_code": self._carrier_code
        }
        
        response = await self.client.get(url, params=params, headers=headers)
        return response
    
    def normalize_data(self, raw_data: dict) -> dict:
        """Normalize DTDC data"""
        events = []
        origin_info = raw_data.get("origin_info", {})
        
        if origin_info and origin_info.get("trackinfo"):
            for event in origin_info["trackinfo"]:
                detail = event.get("tracking_detail", "") or event.get("Details", "Unknown location")
                checkpoint = event.get("checkpoint_status", "") or event.get("StatusDescription", "")
                date = event.get("checkpoint_date", "") or event.get("Date", "")
                
                if detail or checkpoint:
                    events.append({
                        "location": detail,
                        "status": checkpoint,
                        "timestamp": date
                    })
        
        status = raw_data.get("delivery_status", "") or raw_data.get("substatus", "unknown")
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
        origin = events[-1]["location"] if events else ""
        destination = raw_data.get("destination_info", {}).get("recipient_address", "")
        last_updated = raw_data.get("update_at", "") or raw_data.get("updated_at", "")
        
        return {
            "carrier": self._carrier_name,
            "status": friendly_status,
            "origin": origin,
            "destination": destination,
            "last_updated": last_updated,
            "events": events
        }
    
    @property
    def carrier_name(self) -> str:
        return self._carrier_name


class EcomExpressService(CarrierService):
    """Ecom Express carrier service implementation"""
    
    def __init__(self, api_client, api_key: str):
        self.client = api_client
        self.api_key = api_key
        self._carrier_code = "ecom-express"
        self._carrier_name = "Ecom Express"
    
    async def create_tracking(self, tracking_number: str) -> Dict[str, Any]:
        """Register tracking with TrackingMore for Ecom Express"""
        headers = {
            "Tracking-Api-Key": self.api_key,
            "Content-Type": "application/json"
        }
        
        url = "https://api.trackingmore.com/v4/trackings/create"
        payload = {
            "tracking_number": tracking_number,
            "courier_code": self._carrier_code
        }
        
        response = await self.client.post(url, json=payload, headers=headers)
        return response
    
    async def get_tracking(self, tracking_number: str) -> Dict[str, Any]:
        """Fetch tracking data for Ecom Express"""
        headers = {
            "Tracking-Api-Key": self.api_key,
            "Content-Type": "application/json"
        }
        
        url = "https://api.trackingmore.com/v4/trackings/get"
        params = {
            "tracking_numbers": tracking_number,
            "courier_code": self._carrier_code
        }
        
        response = await self.client.get(url, params=params, headers=headers)
        return response
    
    def normalize_data(self, raw_data: dict) -> dict:
        """Normalize Ecom Express data"""
        events = []
        origin_info = raw_data.get("origin_info", {})
        
        if origin_info and origin_info.get("trackinfo"):
            for event in origin_info["trackinfo"]:
                detail = event.get("tracking_detail", "") or event.get("Details", "Unknown location")
                checkpoint = event.get("checkpoint_status", "") or event.get("StatusDescription", "")
                date = event.get("checkpoint_date", "") or event.get("Date", "")
                
                if detail or checkpoint:
                    events.append({
                        "location": detail,
                        "status": checkpoint,
                        "timestamp": date
                    })
        
        status = raw_data.get("delivery_status", "") or raw_data.get("substatus", "unknown")
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
        origin = events[-1]["location"] if events else ""
        destination = raw_data.get("destination_info", {}).get("recipient_address", "")
        last_updated = raw_data.get("update_at", "") or raw_data.get("updated_at", "")
        
        return {
            "carrier": self._carrier_name,
            "status": friendly_status,
            "origin": origin,
            "destination": destination,
            "last_updated": last_updated,
            "events": events
        }
    
    @property
    def carrier_name(self) -> str:
        return self._carrier_name


class EkartService(CarrierService):
    """Ekart Logistics carrier service implementation"""
    
    def __init__(self, api_client, api_key: str):
        self.client = api_client
        self.api_key = api_key
        self._carrier_code = "ekart"
        self._carrier_name = "Ekart Logistics"
    
    async def create_tracking(self, tracking_number: str) -> Dict[str, Any]:
        """Register tracking with TrackingMore for Ekart"""
        headers = {
            "Tracking-Api-Key": self.api_key,
            "Content-Type": "application/json"
        }
        
        url = "https://api.trackingmore.com/v4/trackings/create"
        payload = {
            "tracking_number": tracking_number,
            "courier_code": self._carrier_code
        }
        
        response = await self.client.post(url, json=payload, headers=headers)
        return response
    
    async def get_tracking(self, tracking_number: str) -> Dict[str, Any]:
        """Fetch tracking data for Ekart"""
        headers = {
            "Tracking-Api-Key": self.api_key,
            "Content-Type": "application/json"
        }
        
        url = "https://api.trackingmore.com/v4/trackings/get"
        params = {
            "tracking_numbers": tracking_number,
            "courier_code": self._carrier_code
        }
        
        response = await self.client.get(url, params=params, headers=headers)
        return response
    
    def normalize_data(self, raw_data: dict) -> dict:
        """Normalize Ekart data"""
        events = []
        origin_info = raw_data.get("origin_info", {})
        
        if origin_info and origin_info.get("trackinfo"):
            for event in origin_info["trackinfo"]:
                detail = event.get("tracking_detail", "") or event.get("Details", "Unknown location")
                checkpoint = event.get("checkpoint_status", "") or event.get("StatusDescription", "")
                date = event.get("checkpoint_date", "") or event.get("Date", "")
                
                if detail or checkpoint:
                    events.append({
                        "location": detail,
                        "status": checkpoint,
                        "timestamp": date
                    })
        
        status = raw_data.get("delivery_status", "") or raw_data.get("substatus", "unknown")
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
        origin = events[-1]["location"] if events else ""
        destination = raw_data.get("destination_info", {}).get("recipient_address", "")
        last_updated = raw_data.get("update_at", "") or raw_data.get("updated_at", "")
        
        return {
            "carrier": self._carrier_name,
            "status": friendly_status,
            "origin": origin,
            "destination": destination,
            "last_updated": last_updated,
            "events": events
        }
    
    @property
    def carrier_name(self) -> str:
        return self._carrier_name


class CarrierServiceFactory:
    """Factory for creating carrier service instances"""
    
    _services: Dict[str, type] = {
        "india-post": IndiaPostService,
        "delhivery": DelhiveryService,
        "bluedart": BlueDartService,
        "dtdc": DTDCService,
        "ecom-express": EcomExpressService,
        "ekart": EkartService,
    }
    
    @classmethod
    def get_service(cls, carrier_code: str, api_client, api_key: str) -> CarrierService:
        """
        Get carrier service instance
        
        Args:
            carrier_code: Carrier identifier (e.g., 'india-post')
            api_client: HTTP client instance
            api_key: API key for the service
            
        Returns:
            CarrierService instance
            
        Raises:
            ValueError: If carrier not supported
        """
        service_class = cls._services.get(carrier_code.lower())
        
        if not service_class:
            raise ValueError(f"Carrier '{carrier_code}' is not supported")
        
        return service_class(api_client, api_key)
    
    @classmethod
    def supported_carriers(cls) -> list:
        """Get list of supported carriers"""
        return list(cls._services.keys())
