# Dockerfile pour l'API Air Paradis Sentiment Analysis - TensorFlow 2.13 Compatible
FROM python:3.10-slim

# Définir le répertoire de travail
WORKDIR /app

# Variables d'environnement pour TensorFlow 2.13
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1
ENV DEBIAN_FRONTEND=noninteractive
ENV TF_CPP_MIN_LOG_LEVEL=2
ENV TF_ENABLE_ONEDNN_OPTS=0

# Installation des dépendances système
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copier les fichiers de requirements
COPY requirements.txt .

# Installation des dépendances Python avec versions spécifiques pour compatibility
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir typing-extensions==4.13.2 && \
    pip install --no-cache-dir tensorflow==2.16.1 && \
    pip install --no-cache-dir -r requirements.txt

# Télécharger les données NLTK nécessaires
RUN python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')" || true

# Copier le code de l'application
COPY app/ ./app/
COPY config/ ./config/
COPY models/ ./models/
COPY monitoring/ ./monitoring/

# Créer un utilisateur non-root pour la sécurité
RUN groupadd -r appuser && useradd -r -g appuser appuser
RUN chown -R appuser:appuser /app
USER appuser

# Exposer le port
EXPOSE 8000

# Commande de santé
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Commande de démarrage
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
