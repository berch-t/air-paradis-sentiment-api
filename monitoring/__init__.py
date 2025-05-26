"""
Module de monitoring pour l'API Air Paradis
"""

from .gcp_monitor import GoogleCloudMonitoring, get_monitoring

__all__ = ["GoogleCloudMonitoring", "get_monitoring"]
