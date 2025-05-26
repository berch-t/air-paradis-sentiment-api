"""
Air Paradis Sentiment Analysis API - Version Compatible Anciennes Dépendances
API FastAPI pour l'analyse de sentiment des tweets
Compatible avec FastAPI 0.95.x et Pydantic 1.10.x
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

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# Pydantic v1 ancien
from pydantic import BaseModel, Field, validator

# Configuration logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration TensorFlow
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
tf.get_logger().setLevel('ERROR')

# Configuration MLflow avec gestion d'erreur
try:
    import mlflow
    MLFLOW_AVAILABLE = True
    mlflow.set_tracking_uri("http://localhost:5000")
    mlflow.set_experiment("air_paradis_sentiment_production")
except Exception as e:
    logger.warning(f"MLflow non disponible: {e}")
    MLFLOW_AVAILABLE = False

MAX_SEQUENCE_LENGTH = 50

class CompatibleTokenizer:
    """Tokenizer compatible pour TensorFlow 2.13"""
    
    def __init__(self, word_index, num_words=None):
        self.word_index = word_index
        self.num_words = num_words or len(word_index)
    
    def texts_to_sequences(self, texts):
        sequences = []
        for text in texts:
            words = text.lower().split()
            sequence = [self.word_index.get(word, 0) for word in words]
            sequences.append(sequence)
        return sequences

class SimpleModelManager:
    """Gestionnaire de modèle simplifié"""
    
    def __init__(self):
        self.model = None
        self.tokenizer = None
        self.is_dummy = False
        self.model_path = "models/best_advanced_model_BiLSTM_Word2Vec.h5"
        self.tokenizer_path = "models/best_advanced_model_tokenizer.pickle"
    
    def load_model(self):
        """Charge le modèle avec gestion d'erreurs simplifiée"""
        logger.info("Chargement du modèle...")
        
        # Chargement du modèle
        if os.path.exists(self.model_path):
            try:
                self.model = load_model(self.model_path, compile=False)
                logger.info("✅ Modèle TensorFlow chargé")
            except Exception as e:
                logger.warning(f"⚠️ Erreur modèle: {e}")
                self.model = self._create_dummy_model()
                self.is_dummy = True
        else:
            self.model = self._create_dummy_model()
            self.is_dummy = True
        
        # Chargement du tokenizer
        if os.path.exists(self.tokenizer_path):
            try:
                with open(self.tokenizer_path, 'rb') as f:
                    tokenizer_data = pickle.load(f)
                
                if hasattr(tokenizer_data, 'word_index'):
                    word_index = tokenizer_data.word_index
                    self.tokenizer = CompatibleTokenizer(word_index)
                    logger.info("✅ Tokenizer extrait du modèle")
                else:
                    self.tokenizer = self._create_dummy_tokenizer()
                    
            except Exception as e:
                logger.warning(f"⚠️ Erreur tokenizer: {e}")
                self.tokenizer = self._create_dummy_tokenizer()
        else:
            self.tokenizer = self._create_dummy_tokenizer()
        
        logger.info(f"✅ Modèle prêt ({'factice' if self.is_dummy else 'réel'})")
    
    def _create_dummy_model(self):
        """Crée un modèle factice simple"""
        from tensorflow.keras.models import Sequential
        from tensorflow.keras.layers import Embedding, LSTM, Dense
        
        model = Sequential([
            Embedding(1000, 100, input_length=MAX_SEQUENCE_LENGTH),
            LSTM(64),
            Dense(1, activation='sigmoid')
        ])
        model.compile(optimizer='adam', loss='binary_crossentropy')
        
        # Entraînement minimal
        dummy_X = np.random.randint(0, 1000, (10, MAX_SEQUENCE_LENGTH))
        dummy_y = np.random.randint(0, 2, (10, 1))
        model.fit(dummy_X, dummy_y, epochs=1, verbose=0)
        
        return model
    
    def _create_dummy_tokenizer(self):
        """Crée un tokenizer factice"""
        word_index = {
            'love': 1, 'great': 2, 'excellent': 3, 'amazing': 4,
            'hate': 5, 'terrible': 6, 'bad': 7, 'awful': 8,
            'airline': 9, 'flight': 10, 'service': 11, 'air': 12, 'paradis': 13
        }
        return CompatibleTokenizer(word_index)
    
    def predict(self, text: str) -> Dict:
        """Prédiction simplifiée"""
        try:
            # Tokenisation
            sequences = self.tokenizer.texts_to_sequences([text])
            padded = pad_sequences(sequences, maxlen=MAX_SEQUENCE_LENGTH)
            
            # Prédiction
            prediction_prob = self.model.predict(padded, verbose=0)[0][0]
            sentiment = "positive" if prediction_prob > 0.5 else "negative"
            confidence = float(prediction_prob) if prediction_prob > 0.5 else float(1 - prediction_prob)
            
            result = {
                "text": text,
                "sentiment": sentiment,
                "confidence": round(confidence, 4),
                "probability": round(float(prediction_prob), 4),
                "model": "BiLSTM_Word2Vec" + (" (factice)" if self.is_dummy else ""),
                "timestamp": datetime.utcnow().isoformat()
            }
            
            # MLflow si disponible
            if MLFLOW_AVAILABLE:
                try:
                    with mlflow.start_run():
                        mlflow.log_metric("confidence", confidence)
                        mlflow.log_param("sentiment", sentiment)
                except:
                    pass
            
            return result
            
        except Exception as e:
            logger.error(f"Erreur prédiction: {e}")
            raise

# Instance globale
model_manager = SimpleModelManager()

# Modèles Pydantic simples
class SentimentRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=500)
    
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
    timestamp: str

class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    model_type: str
    tensorflow_version: str

# Application FastAPI
app = FastAPI(
    title="Air Paradis Sentiment API",
    description="API d'analyse de sentiment - Version Compatible",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Chargement initial du modèle
@app.on_event("startup")
async def startup_event():
    model_manager.load_model()

# Routes
@app.get("/")
async def root():
    return {
        "message": "Air Paradis Sentiment API",
        "version": "1.0.0",
        "tensorflow_version": tf.__version__,
        "model_type": "factice" if model_manager.is_dummy else "réel"
    }

@app.get("/health", response_model=HealthResponse)
async def health():
    return HealthResponse(
        status="healthy",
        model_loaded=model_manager.model is not None,
        model_type="factice" if model_manager.is_dummy else "réel",
        tensorflow_version=tf.__version__
    )

@app.post("/predict", response_model=SentimentResponse)
async def predict(request: SentimentRequest):
    try:
        result = model_manager.predict(request.text)
        return SentimentResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
