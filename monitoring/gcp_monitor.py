"""
Module de monitoring pour Google Cloud
Équivalent d'Azure Application Insights pour Google Cloud
"""

import os
import logging
import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import asyncio

from google.cloud import monitoring_v3
from google.cloud import logging as gcp_logging
from google.cloud import pubsub_v1

logger = logging.getLogger(__name__)

class GoogleCloudMonitoring:
    """Gestionnaire de monitoring Google Cloud"""
    
    def __init__(self, project_id: str, region: str = "europe-west1"):
        self.project_id = project_id
        self.region = region
        self.project_name = f"projects/{project_id}"
        
        # Clients Google Cloud
        self.monitoring_client = monitoring_v3.MetricServiceClient()
        self.logging_client = gcp_logging.Client(project=project_id)
        
        # Configuration des alertes
        self.error_threshold = 3
        self.time_window_minutes = 5
        self.alert_email = "berchet.thomas@gmail.com"
        
        # Cache des erreurs récentes
        self.recent_errors = []
        
        # Setup logging
        self.logging_client.setup_logging()
        self.logger = self.logging_client.logger("air-paradis-sentiment-api")
    
    async def log_error(self, message: str, text: str, error_type: str = "prediction_error"):
        """Enregistre une erreur dans Google Cloud Logging"""
        try:
            error_data = {
                "timestamp": datetime.utcnow().isoformat(),
                "message": message,
                "text": text,
                "error_type": error_type,
                "service": "air-paradis-sentiment-api"
            }
            
            # Log structuré dans Google Cloud Logging
            self.logger.log_struct(error_data, severity="ERROR")
            
            # Ajouter à la liste des erreurs récentes
            self.recent_errors.append({
                "timestamp": datetime.utcnow(),
                "message": message,
                "text": text
            })
            
            # Nettoyer les anciennes erreurs
            self._cleanup_old_errors()
            
            # Vérifier si on doit déclencher une alerte
            if len(self.recent_errors) >= self.error_threshold:
                await self._trigger_alert()
            
            logger.info(f"✅ Erreur enregistrée dans Google Cloud Logging: {message}")
            
        except Exception as e:
            logger.error(f"❌ Erreur lors de l'enregistrement dans Google Cloud: {str(e)}")
    
    async def log_feedback(self, feedback_data: Dict):
        """Enregistre un feedback utilisateur"""
        try:
            log_data = {
                "timestamp": datetime.utcnow().isoformat(),
                "feedback_type": "user_feedback",
                "is_correct": feedback_data.get("is_correct", False),
                "predicted_sentiment": feedback_data.get("predicted_sentiment"),
                "actual_sentiment": feedback_data.get("actual_sentiment"),
                "text": feedback_data.get("text", ""),
                "user_id": feedback_data.get("user_id", "anonymous"),
                "service": "air-paradis-sentiment-api"
            }
            
            severity = "INFO" if feedback_data.get("is_correct", False) else "WARNING"
            self.logger.log_struct(log_data, severity=severity)
            
            logger.info(f"✅ Feedback enregistré: {'correct' if feedback_data.get('is_correct') else 'incorrect'}")
            
        except Exception as e:
            logger.error(f"❌ Erreur lors de l'enregistrement du feedback: {str(e)}")
    
    async def log_prediction(self, prediction_data: Dict):
        """Enregistre une prédiction réussie"""
        try:
            log_data = {
                "timestamp": datetime.utcnow().isoformat(),
                "event_type": "prediction",
                "sentiment": prediction_data.get("sentiment"),
                "confidence": prediction_data.get("confidence"),
                "text_length": len(prediction_data.get("text", "")),
                "model": prediction_data.get("model", "BiLSTM_Word2Vec"),
                "service": "air-paradis-sentiment-api"
            }
            
            self.logger.log_struct(log_data, severity="INFO")
            
        except Exception as e:
            logger.error(f"❌ Erreur lors de l'enregistrement de la prédiction: {str(e)}")
    
    def _cleanup_old_errors(self):
        """Nettoie les erreurs anciennes (plus de 5 minutes)"""
        cutoff_time = datetime.utcnow() - timedelta(minutes=self.time_window_minutes)
        self.recent_errors = [
            error for error in self.recent_errors 
            if error["timestamp"] > cutoff_time
        ]
    
    async def _trigger_alert(self):
        """Déclenche une alerte lorsque le seuil d'erreurs est atteint"""
        try:
            alert_message = f"""
            🚨 ALERTE Air Paradis Sentiment API 🚨
            
            {len(self.recent_errors)} erreurs détectées en {self.time_window_minutes} minutes.
            
            Dernières erreurs:
            {chr(10).join([f"- {error['message']}" for error in self.recent_errors[-3:]])}
            
            Timestamp: {datetime.utcnow().isoformat()}
            Projet: {self.project_id}
            """
            
            # Log de l'alerte
            alert_data = {
                "timestamp": datetime.utcnow().isoformat(),
                "alert_type": "error_threshold_exceeded",
                "error_count": len(self.recent_errors),
                "time_window_minutes": self.time_window_minutes,
                "threshold": self.error_threshold,
                "recent_errors": [error["message"] for error in self.recent_errors],
                "service": "air-paradis-sentiment-api"
            }
            
            self.logger.log_struct(alert_data, severity="CRITICAL")
            
            # TODO: Intégrer avec Google Cloud Pub/Sub pour envoyer l'email
            # ou utiliser Google Cloud Functions avec SendGrid/Gmail API
            
            logger.critical(f"🚨 ALERTE DÉCLENCHÉE: {len(self.recent_errors)} erreurs en {self.time_window_minutes} minutes")
            
            # Réinitialiser le compteur après l'alerte
            self.recent_errors = []
            
        except Exception as e:
            logger.error(f"❌ Erreur lors du déclenchement de l'alerte: {str(e)}")
    
    async def create_custom_metric(self, metric_name: str, value: float, labels: Dict = None):
        """Crée une métrique personnalisée dans Google Cloud Monitoring"""
        try:
            series = monitoring_v3.TimeSeries()
            series.metric.type = f"custom.googleapis.com/air_paradis/{metric_name}"
            series.resource.type = "global"
            
            if labels:
                for key, val in labels.items():
                    series.metric.labels[key] = str(val)
            
            now = datetime.utcnow()
            seconds = int(now.timestamp())
            nanos = int((now.timestamp() - seconds) * 10**9)
            
            interval = monitoring_v3.TimeInterval(
                {"end_time": {"seconds": seconds, "nanos": nanos}}
            )
            
            point = monitoring_v3.Point({
                "interval": interval,
                "value": {"double_value": value},
            })
            
            series.points = [point]
            
            self.monitoring_client.create_time_series(
                name=self.project_name, 
                time_series=[series]
            )
            
            logger.info(f"✅ Métrique créée: {metric_name} = {value}")
            
        except Exception as e:
            logger.error(f"❌ Erreur lors de la création de la métrique: {str(e)}")
    
    async def get_error_metrics(self) -> Dict:
        """Récupère les métriques d'erreur"""
        return {
            "recent_errors_count": len(self.recent_errors),
            "error_threshold": self.error_threshold,
            "time_window_minutes": self.time_window_minutes,
            "last_cleanup": datetime.utcnow().isoformat()
        }

# Instance globale du monitoring
monitoring = None

def get_monitoring(project_id: str = None, region: str = "europe-west1") -> GoogleCloudMonitoring:
    """Récupère l'instance de monitoring"""
    global monitoring
    if monitoring is None:
        if project_id is None:
            project_id = os.getenv("GOOGLE_CLOUD_PROJECT", "air-paradis-sentiment")
        monitoring = GoogleCloudMonitoring(project_id, region)
    return monitoring
