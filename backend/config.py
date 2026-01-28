"""
Configuration management for DakDash Backend
Environment variables and application settings
"""

from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # API Configuration
    TRACKINGMORE_API_KEY: str = ""
    
    # CORS Configuration
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "https://*.vercel.app",  # Allow all Vercel preview/production deployments
        "https://dakdash.vercel.app",  # Production domain (update after deployment)
    ]
    
    # Application Settings
    APP_NAME: str = "DakDash API"
    DEBUG: bool = False
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


# Global settings instance
settings = Settings()
