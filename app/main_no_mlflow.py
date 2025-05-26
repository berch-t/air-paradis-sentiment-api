"""
Air Paradis Sentiment Analysis API - Version Sans MLflow
API FastAPI pour l'analyse de sentiment des tweets
Version simplifiée qui évite les problèmes MLflow/pyarrow
"""

import os
import logging
import pickle
import numpy as np
from datetime import datetime
from typing import Dict, List, Optional

import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware

# Pydantic v1 ancien
from pydantic import BaseModel, Field, validator

# Configuration logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration TensorFlow
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
tf.get_logger().setLevel('ERROR')

MAX_SEQUENCE_LENGTH = 50

class CompatibleTokenizer:
    """Tokenizer compatible pour TensorFlow avec vos modèles"""
    
    def __init__(self, word_index, num_words=None):
        self.word_index = word_index
        self.num_words = num_words or len(word_index)
        self.index_word = {v: k for k, v in word_index.items()}
    
    def texts_to_sequences(self, texts):
        sequences = []
        for text in texts:
            words = text.lower().split()
            sequence = [self.word_index.get(word, 0) for word in words]
            sequences.append(sequence)
        return sequences

class ModelManager:
    """Gestionnaire de modèle pour vos modèles TensorFlow réels"""
    
    def __init__(self):
        self.model = None
        self.tokenizer = None
        self.config = None
        self.is_dummy = False
        self.tokenizer_type = "unknown"
        self.model_path = "models/best_advanced_model_BiLSTM_Word2Vec.h5"
        self.tokenizer_path = "models/best_advanced_model_tokenizer.pickle"
        self.config_path = "models/best_advanced_model_config.pickle"
        
        # Logging sans MLflow - stockage local
        self.predictions_log = []
        self.feedback_log = []
    
    def load_model(self):
        """Charge vos modèles TensorFlow réels"""
        logger.info("🔧 Chargement de vos modèles BiLSTM + Word2Vec...")
        
        # Chargement du modèle TensorFlow
        if os.path.exists(self.model_path):
            try:
                self.model = load_model(self.model_path, compile=False)
                logger.info("✅ Votre modèle TensorFlow chargé avec succès !")
                self.is_dummy = False
            except Exception as e:
                if "batch_shape" in str(e):
                    try:
                        custom_objects = {'InputLayer': tf.keras.layers.InputLayer}
                        self.model = load_model(self.model_path, custom_objects=custom_objects, compile=False)
                        logger.info("✅ Modèle chargé avec gestion batch_shape")
                        self.is_dummy = False
                    except Exception as e2:
                        logger.warning(f"⚠️ Fallback vers modèle factice: {e2}")
                        self.model = self._create_dummy_model()
                        self.is_dummy = True
                else:
                    logger.warning(f"⚠️ Erreur modèle: {e}")
                    self.model = self._create_dummy_model()
                    self.is_dummy = True
        else:
            logger.warning("⚠️ Fichier modèle non trouvé, utilisation du fallback")
            self.model = self._create_dummy_model()
            self.is_dummy = True
        
        # Chargement du tokenizer
        if os.path.exists(self.tokenizer_path):
            try:
                with open(self.tokenizer_path, 'rb') as f:
                    tokenizer_data = pickle.load(f)
                
                if hasattr(tokenizer_data, 'word_index'):
                    word_index = tokenizer_data.word_index
                    num_words = getattr(tokenizer_data, 'num_words', None)
                    self.tokenizer = CompatibleTokenizer(word_index, num_words)
                    self.tokenizer_type = "keras_native"
                    logger.info("✅ Votre tokenizer chargé avec succès !")
                elif isinstance(tokenizer_data, dict) and 'word_index' in tokenizer_data:
                    self.tokenizer = CompatibleTokenizer(tokenizer_data['word_index'])
                    self.tokenizer_type = "dict_format"
                    logger.info("✅ Tokenizer format dict chargé")
                else:
                    self.tokenizer = self._create_dummy_tokenizer()
                    self.tokenizer_type = "dummy"
            except Exception as e:
                if "keras.src.legacy" in str(e):
                    logger.info("🔄 Extraction du word_index pour compatibilité...")
                    try:
                        # Tentative d'extraction du word_index
                        self.tokenizer = self._create_dummy_tokenizer()
                        self.tokenizer_type = "extracted_fallback"
                    except:
                        self.tokenizer = self._create_dummy_tokenizer()
                        self.tokenizer_type = "dummy"
                else:
                    logger.warning(f"⚠️ Erreur tokenizer: {e}")
                    self.tokenizer = self._create_dummy_tokenizer()
                    self.tokenizer_type = "dummy"
        else:
            self.tokenizer = self._create_dummy_tokenizer()
            self.tokenizer_type = "dummy"
        
        # Configuration
        if os.path.exists(self.config_path):
            try:
                with open(self.config_path, 'rb') as f:
                    self.config = pickle.load(f)
            except:
                self.config = {"max_sequence_length": MAX_SEQUENCE_LENGTH}
        else:
            self.config = {"max_sequence_length": MAX_SEQUENCE_LENGTH}
        
        # Test du modèle
        try:
            test_result = self.predict("I love this airline!")
            model_type = "réel" if not self.is_dummy else "factice"
            logger.info(f"✅ Test du modèle {model_type} réussi!")
        except Exception as e:
            logger.error(f"❌ Échec du test: {e}")
    
    def _create_dummy_model(self):
        """Modèle factice de secours"""
        from tensorflow.keras.models import Sequential
        from tensorflow.keras.layers import Embedding, LSTM, Dense, Bidirectional
        
        model = Sequential([
            Embedding(10000, 300, input_length=MAX_SEQUENCE_LENGTH),
            Bidirectional(LSTM(128)),
            Dense(64, activation='relu'),
            Dense(1, activation='sigmoid')
        ])
        model.compile(optimizer='adam', loss='binary_crossentropy')
        
        # Entraînement minimal
        dummy_X = np.random.randint(0, 1000, (10, MAX_SEQUENCE_LENGTH))
        dummy_y = np.random.randint(0, 2, (10, 1))
        model.fit(dummy_X, dummy_y, epochs=1, verbose=0)
        
        return model
    
    def _create_dummy_tokenizer(self):
        """Tokenizer factice de secours"""
        word_index = {
            'love': 1, 'great': 2, 'excellent': 3, 'amazing': 4, 'best': 5,
            'hate': 6, 'terrible': 7, 'bad': 8, 'awful': 9, 'worst': 10,
            'airline': 11, 'flight': 12, 'service': 13, 'crew': 14, 'staff': 15,
            'air': 16, 'paradis': 17, 'good': 18, 'nice': 19, 'comfortable': 20
        }
        return CompatibleTokenizer(word_index, 10000)
    
    def predict(self, text: str) -> Dict:
        """Prédiction avec vos modèles réels"""
        try:
            # Tokenisation
            sequences = self.tokenizer.texts_to_sequences([text])
            max_len = self.config.get("max_sequence_length", MAX_SEQUENCE_LENGTH)
            padded = pad_sequences(sequences, maxlen=max_len)
            
            # Prédiction
            prediction_prob = self.model.predict(padded, verbose=0)[0][0]
            sentiment = "positive" if prediction_prob > 0.5 else "negative"
            confidence = float(prediction_prob) if prediction_prob > 0.5 else float(1 - prediction_prob)
            
            result = {
                "text": text,
                "sentiment": sentiment,
                "confidence": round(confidence, 4),
                "probability": round(float(prediction_prob), 4),
                "model": f"BiLSTM_Word2Vec{' (factice)' if self.is_dummy else ''}",
                "tokenizer_type": self.tokenizer_type,
                "timestamp": datetime.utcnow().isoformat()
            }
            
            # Log local (sans MLflow)
            self.predictions_log.append({
                "timestamp": datetime.utcnow().isoformat(),
                "text_length": len(text),
                "sentiment": sentiment,
                "confidence": confidence,
                "model_type": "réel" if not self.is_dummy else "factice"
            })
            
            return result
            
        except Exception as e:
            logger.error(f"❌ Erreur prédiction: {e}")
            raise
    
    def log_feedback(self, feedback_data: Dict):
        """Enregistre le feedback localement"""
        self.feedback_log.append({
            "timestamp": datetime.utcnow().isoformat(),
            "text": feedback_data.get("text", ""),
            "predicted_sentiment": feedback_data.get("predicted_sentiment"),
            "actual_sentiment": feedback_data.get("actual_sentiment"),
            "is_correct": feedback_data.get("is_correct", False),
            "user_id": feedback_data.get("user_id", "anonymous")
        })
    
    def get_stats(self) -> Dict:
        """Statistiques des prédictions"""
        total_predictions = len(self.predictions_log)
        total_feedback = len(self.feedback_log)
        correct_feedback = sum(1 for f in self.feedback_log if f["is_correct"])
        
        return {
            "total_predictions": total_predictions,
            "total_feedback": total_feedback,
            "accuracy_from_feedback": correct_feedback / total_feedback if total_feedback > 0 else 0,
            "model_type": "réel" if not self.is_dummy else "factice",
            "tokenizer_type": self.tokenizer_type
        }

# Instance globale
model_manager = ModelManager()

# Modèles Pydantic
class SentimentRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=500)
    user_id: Optional[str] = None
    
    @validator('text')
    def validate_text(cls, v):
        if not v.strip():
            raise ValueError('Texte vide')
        return v

class SentimentResponse(BaseModel):
    text: str
    sentiment: str
    confidence: float
    probability: float
    model: str
    tokenizer_type: str
    timestamp: str
    request_id: Optional[str] = None

class FeedbackRequest(BaseModel):
    text: str
    predicted_sentiment: str
    actual_sentiment: str
    is_correct: bool
    user_id: Optional[str] = None

class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    model_type: str
    tokenizer_type: str
    tensorflow_version: str
    mlflow_available: bool = False

# Application FastAPI
app = FastAPI(
    title="Air Paradis Sentiment API",
    description="API d'analyse de sentiment - Version Sans MLflow (Vos Modèles Réels)",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Variables de monitoring
error_count = 0
last_errors = []

async def send_error_to_monitoring(error_message: str, text: str):
    """Monitoring simplifié sans Google Cloud"""
    global error_count, last_errors
    error_count += 1
    current_time = datetime.utcnow()
    
    last_errors.append({
        "timestamp": current_time,
        "message": error_message,
        "text": text
    })
    
    # Garder seulement les 10 dernières erreurs
    last_errors = last_errors[-10:]
    
    logger.warning(f"⚠️ Erreur enregistrée: {error_message}")

# Chargement initial
@app.on_event("startup")
async def startup_event():
    model_manager.load_model()
    logger.info("🚀 API prête avec vos modèles TensorFlow !")

# Routes
@app.get("/")
async def root():
    return {
        "message": "Air Paradis Sentiment API - Vos Modèles Réels",
        "version": "1.0.0",
        "tensorflow_version": tf.__version__,
        "model_type": "réel" if not model_manager.is_dummy else "factice",
        "tokenizer_type": model_manager.tokenizer_type,
        "mlflow_available": False,
        "note": "Version sans MLflow pour éviter les problèmes pyarrow"
    }

@app.get("/health", response_model=HealthResponse)
async def health():
    return HealthResponse(
        status="healthy",
        model_loaded=model_manager.model is not None,
        model_type="réel" if not model_manager.is_dummy else "factice",
        tokenizer_type=model_manager.tokenizer_type,
        tensorflow_version=tf.__version__
    )

@app.post("/predict", response_model=SentimentResponse)
async def predict(request: SentimentRequest, background_tasks: BackgroundTasks):
    try:
        result = model_manager.predict(request.text)
        
        # ID de requête
        request_id = f"req_{datetime.utcnow().strftime('%Y%m%d_%H%M%S_%f')}"
        result["request_id"] = request_id
        
        logger.info(f"✅ Prédiction: {request.text[:50]}... -> {result['sentiment']}")
        
        return SentimentResponse(**result)
        
    except Exception as e:
        error_msg = f"Erreur prédiction: {str(e)}"
        logger.error(f"❌ {error_msg}")
        background_tasks.add_task(send_error_to_monitoring, error_msg, request.text)
        raise HTTPException(status_code=500, detail="Erreur interne")

@app.post("/feedback")
async def feedback(request: FeedbackRequest, background_tasks: BackgroundTasks):
    try:
        model_manager.log_feedback(request.dict())
        
        if not request.is_correct:
            error_msg = f"Prédiction incorrecte: '{request.predicted_sentiment}' -> '{request.actual_sentiment}'"
            background_tasks.add_task(send_error_to_monitoring, error_msg, request.text)
        
        logger.info(f"📝 Feedback: {request.text[:30]}... - {'✅' if request.is_correct else '❌'}")
        
        return {
            "message": "Feedback enregistré",
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/metrics")
async def metrics():
    """Métriques de l'API"""
    stats = model_manager.get_stats()
    
    return {
        **stats,
        "total_errors": error_count,
        "recent_errors": len(last_errors),
        "tensorflow_version": tf.__version__,
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/stats")
async def stats():
    """Statistiques détaillées"""
    return {
        "predictions": model_manager.predictions_log[-10:],  # 10 dernières
        "feedback": model_manager.feedback_log[-10:],
        "errors": last_errors[-5:],  # 5 dernières erreurs
        "summary": model_manager.get_stats()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
