"""
Configuration de l'application Air Paradis Sentiment API
"""
import os
from typing import Optional

class Settings:
    """Configuration de l'application"""
    
    # Configuration de base
    APP_NAME: str = "Air Paradis Sentiment API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    
    # Configuration du serveur
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", 8000))
    
    # Configuration MLflow
    MLFLOW_TRACKING_URI: str = os.getenv("MLFLOW_TRACKING_URI", "http://localhost:5000")
    MLFLOW_EXPERIMENT_NAME: str = os.getenv("MLFLOW_EXPERIMENT_NAME", "air_paradis_sentiment_production")
    
    # Configuration Google Cloud
    GOOGLE_CLOUD_PROJECT: str = os.getenv("GOOGLE_CLOUD_PROJECT", "air-paradis-sentiment")
    GOOGLE_CLOUD_REGION: str = os.getenv("GOOGLE_CLOUD_REGION", "europe-west1")
    
    # Configuration du modèle
    MODEL_PATH: str = os.getenv("MODEL_PATH", "models/best_advanced_model_BiLSTM_Word2Vec.h5")
    TOKENIZER_PATH: str = os.getenv("TOKENIZER_PATH", "models/best_advanced_model_tokenizer.pickle")
    CONFIG_PATH: str = os.getenv("CONFIG_PATH", "models/best_advanced_model_config.pickle")
    MAX_SEQUENCE_LENGTH: int = int(os.getenv("MAX_SEQUENCE_LENGTH", 50))
    
    # Configuration de monitoring
    ALERT_EMAIL: str = os.getenv("ALERT_EMAIL", "berchet.thomas@gmail.com")
    ERROR_THRESHOLD: int = int(os.getenv("ERROR_THRESHOLD", 3))
    ERROR_TIME_WINDOW_MINUTES: int = int(os.getenv("ERROR_TIME_WINDOW_MINUTES", 5))
    
    # Configuration de logging
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    
    # Configuration de sécurité
    CORS_ORIGINS: list = os.getenv("CORS_ORIGINS", "*").split(",")
    
    @property
    def is_production(self) -> bool:
        """Vérifie si l'application est en production"""
        return not self.DEBUG and os.getenv("ENVIRONMENT", "development").lower() == "production"

# Instance globale des settings
settings = Settings()
