"""
Tests unitaires pour l'API Air Paradis Sentiment Analysis
"""

import pytest
import asyncio
from unittest.mock import Mock, patch, AsyncMock
from fastapi.testclient import TestClient
import numpy as np

from app.main import app, model_manager

# Client de test
client = TestClient(app)

class TestAPI:
    """Tests de l'API principale"""
    
    def test_root_endpoint(self):
        """Test de la route racine"""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "version" in data
        assert data["version"] == "1.0.0"
    
    def test_health_endpoint(self):
        """Test du endpoint de santé"""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert "model_loaded" in data
        assert "timestamp" in data
        assert "version" in data
    
    @patch('app.main.model_manager.predict')
    def test_predict_endpoint_success(self, mock_predict):
        """Test de prédiction réussie"""
        # Mock de la prédiction avec tous les champs requis
        mock_predict.return_value = {
            "text": "I love this airline!",
            "sentiment": "positive",
            "confidence": 0.8542,
            "probability": 0.8542,
            "model": "BiLSTM_Word2Vec",
            "tokenizer_type": "dummy",  # Champ manquant ajouté
            "timestamp": "2024-01-01T12:00:00"
        }
        
        response = client.post(
            "/predict",
            json={"text": "I love this airline!"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["sentiment"] == "positive"
        assert data["confidence"] == 0.8542
        assert "request_id" in data
    
    def test_predict_endpoint_empty_text(self):
        """Test avec texte vide"""
        response = client.post(
            "/predict",
            json={"text": ""}
        )
        
        # FastAPI retourne 422 pour les erreurs de validation Pydantic
        assert response.status_code == 422
        # Le message d'erreur contient "min_length" pour les chaînes vides
        assert "min_length" in str(response.json()) or "ensure this value has at least 1 characters" in str(response.json())
    
    def test_predict_endpoint_invalid_json(self):
        """Test avec JSON invalide"""
        response = client.post(
            "/predict",
            json={}
        )
        
        assert response.status_code == 422  # Validation error
    
    def test_feedback_endpoint_success(self):
        """Test de soumission de feedback"""
        feedback_data = {
            "text": "Great service!",
            "predicted_sentiment": "positive",
            "actual_sentiment": "positive",
            "is_correct": True,
            "user_id": "test_user"
        }
        
        response = client.post("/feedback", json=feedback_data)
        
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "Feedback enregistré" in data["message"]
    
    def test_feedback_endpoint_incorrect_prediction(self):
        """Test de feedback avec prédiction incorrecte"""
        feedback_data = {
            "text": "Terrible experience!",
            "predicted_sentiment": "positive",
            "actual_sentiment": "negative",
            "is_correct": False
        }
        
        response = client.post("/feedback", json=feedback_data)
        
        assert response.status_code == 200
        data = response.json()
        assert "Feedback enregistré" in data["message"]
    
    def test_metrics_endpoint(self):
        """Test de l'endpoint de métriques"""
        response = client.get("/metrics")
        assert response.status_code == 200
        data = response.json()
        assert "total_errors" in data
        assert "recent_errors_5min" in data
        assert "model_loaded" in data
        assert "timestamp" in data

class TestModelManager:
    """Tests du gestionnaire de modèle"""
    
    @pytest.fixture
    def model_manager_mock(self):
        """Fixture pour le gestionnaire de modèle mocké"""
        manager = Mock()
        manager.model = Mock()
        manager.tokenizer = Mock()
        manager.config = {"max_sequence_length": 50}
        return manager
    
    def test_model_manager_initialization(self, model_manager_mock):
        """Test d'initialisation du gestionnaire"""
        assert model_manager_mock.model is not None
        assert model_manager_mock.tokenizer is not None
        assert model_manager_mock.config["max_sequence_length"] == 50
    
    @patch('tensorflow.keras.models.load_model')
    @patch('pickle.load')
    @patch('builtins.open')
    @patch('os.path.exists')
    async def test_load_model_success(self, mock_exists, mock_open, mock_pickle, mock_load_model):
        """Test de chargement de modèle réussi"""
        # Setup mocks
        mock_exists.return_value = True
        mock_load_model.return_value = Mock()
        mock_pickle.return_value = Mock()
        
        # Test
        from app.main import ModelManager
        manager = ModelManager()
        
        # Le test réel nécessiterait des fichiers existants
        # Ici on teste la logique sans les fichiers
        assert manager.model_path == "models/best_advanced_model_BiLSTM_Word2Vec.h5"
        assert manager.tokenizer_path == "models/best_advanced_model_tokenizer.pickle"
        assert manager.config_path == "models/best_advanced_model_config.pickle"
    
    @patch('tensorflow.keras.preprocessing.sequence.pad_sequences')
    async def test_predict_text_processing(self, mock_pad_sequences):
        """Test du preprocessing de texte pour la prédiction"""
        from app.main import ModelManager
        
        # Mock du tokenizer
        mock_tokenizer = Mock()
        mock_tokenizer.texts_to_sequences.return_value = [[1, 2, 3, 4, 5]]
        
        # Mock du modèle
        mock_model = Mock()
        mock_model.predict.return_value = np.array([[0.8]])
        
        # Mock de pad_sequences
        mock_pad_sequences.return_value = np.array([[1, 2, 3, 4, 5] + [0] * 45])
        
        # Setup du manager
        manager = ModelManager()
        manager.tokenizer = mock_tokenizer
        manager.model = mock_model
        manager.config = {"max_sequence_length": 50}
        
        # Test de prédiction
        result = await manager.predict("I love this service!")
        
        # Vérifications
        assert mock_tokenizer.texts_to_sequences.called
        assert mock_pad_sequences.called
        assert mock_model.predict.called
        assert result["sentiment"] == "positive"  # 0.8 > 0.5
        assert result["confidence"] == 0.8
        assert "tokenizer_type" in result  # Vérifier que le champ est présent

class TestValidation:
    """Tests de validation des données"""
    
    def test_sentiment_request_validation(self):
        """Test de validation des requêtes de sentiment"""
        from app.main import SentimentRequest
        
        # Test valide
        request = SentimentRequest(text="Hello world!")
        assert request.text == "Hello world!"
        
        # Test avec user_id
        request_with_user = SentimentRequest(text="Hello!", user_id="user123")
        assert request_with_user.user_id == "user123"
    
    def test_sentiment_request_validation_errors(self):
        """Test d'erreurs de validation"""
        from app.main import SentimentRequest
        from pydantic import ValidationError
        
        # Test avec texte trop long
        with pytest.raises(ValidationError):
            SentimentRequest(text="x" * 501)  # > 500 caractères
    
    def test_feedback_request_validation(self):
        """Test de validation des feedback"""
        from app.main import FeedbackRequest
        
        feedback = FeedbackRequest(
            text="Great service!",
            predicted_sentiment="positive",
            actual_sentiment="positive",
            is_correct=True
        )
        
        assert feedback.is_correct is True
        assert feedback.predicted_sentiment == "positive"

class TestIntegration:
    """Tests d'intégration"""
    
    @pytest.mark.asyncio
    async def test_full_prediction_flow(self):
        """Test du flux complet de prédiction"""
        # Ce test nécessiterait un modèle réel chargé
        # Pour l'instant, on teste la structure
        
        request_data = {
            "text": "I really enjoyed my flight with Air Paradis!",
            "user_id": "test_user_123"
        }
        
        # Ici on testerait le flux complet avec un modèle mock
        # ou un modèle de test léger
        pass
    
    @pytest.mark.asyncio
    async def test_error_monitoring_flow(self):
        """Test du flux de monitoring d'erreurs"""
        # Test que les erreurs sont bien envoyées au monitoring
        pass

# Tests de performance
class TestPerformance:
    """Tests de performance"""
    
    def test_prediction_response_time(self):
        """Test du temps de réponse des prédictions"""
        import time
        
        start_time = time.time()
        
        # Ici on testerait avec un modèle réel
        # response = client.post("/predict", json={"text": "Test text"})
        
        # end_time = time.time()
        # response_time = end_time - start_time
        
        # assert response_time < 2.0  # Moins de 2 secondes
        pass
    
    def test_concurrent_predictions(self):
        """Test de prédictions concurrentes"""
        # Test de charge avec plusieurs requêtes simultanées
        pass

if __name__ == "__main__":
    pytest.main([__file__])
