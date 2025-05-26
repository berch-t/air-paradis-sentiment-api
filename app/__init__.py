"""
Air Paradis Sentiment Analysis API
Application FastAPI pour l'analyse de sentiment des tweets

Modules:
- main: API FastAPI principale avec endpoints
- config: Configuration de l'application
- monitoring: Monitoring Google Cloud
"""

__version__ = "1.0.0"
__author__ = "Air Paradis ML Team"
__description__ = "API d'analyse de sentiment pour les tweets - Modèle BiLSTM avec Word2Vec"

# Import des composants principaux
from .main import app, ModelManager

__all__ = ["app", "ModelManager"]
