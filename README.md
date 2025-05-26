# Air Paradis Sentiment Analysis API

🚀 **API FastAPI d'analyse de sentiment pour les tweets - Modèle BiLSTM avec Word2Vec**


Cette API constitue le livrable principal du **Projet 7 : "Réaliser une analyse de sentiments grâce au Deep Learning"** dans le cadre du parcours **Ingénieur IA** d'OpenClassrooms. Le projet simule une mission de conseil pour la compagnie aérienne fictive "Air Paradis" visant à développer un système d'analyse de sentiment des tweets pour anticiper les bad buzz sur les réseaux sociaux.

**Objectifs pédagogiques :**
- Maîtriser les techniques de Deep Learning pour l'analyse de sentiment
- Comparer différentes approches (modèles classiques vs avancés vs BERT)
- Implémenter une démarche MLOps complète (expérimentation, déploiement, monitoring)
- Déployer un modèle en production sur le Cloud avec pipeline CI/CD

## 📋 Table des matières

- [Architecture](#architecture)
- [Prérequis](#prérequis)
- [Installation locale](#installation-locale)
- [Déploiement sur Google Cloud](#déploiement-sur-google-cloud)
- [Configuration MLflow](#configuration-mlflow)
- [Monitoring et alertes](#monitoring-et-alertes)
- [Tests](#tests)
- [API Endpoints](#api-endpoints)
- [Pipeline CI/CD](#pipeline-cicd)

## 🏗️ Architecture

```
google_air-paradis-api/
├── app/
│   └── main.py                 # API FastAPI principale
├── config/
│   ├── __init__.py
│   └── settings.py             # Configuration de l'application
├── models/
│   ├── best_advanced_model_BiLSTM_Word2Vec.h5    # Modèle TensorFlow
│   ├── best_advanced_model_tokenizer.pickle      # Tokenizer
│   └── best_advanced_model_config.pickle         # Configuration du modèle
├── monitoring/
│   ├── __init__.py
│   └── gcp_monitor.py          # Monitoring Google Cloud
├── tests/
│   ├── __init__.py
│   └── test_api.py             # Tests unitaires
├── .github/workflows/
│   └── ci-cd.yml               # Pipeline GitHub Actions
├── requirements.txt            # Dépendances Python
├── Dockerfile                  # Image Docker
├── .dockerignore              # Exclusions Docker
└── README.md                  # Cette documentation
```

## 📦 Prérequis

- **Python 3.10+**
- **Docker** (pour le déploiement)
- **Compte Google Cloud** avec les APIs activées :
  - Cloud Run API
  - Artifact Registry API
  - Cloud Monitoring API
  - Cloud Logging API
- **MLflow** pour le tracking des expérimentations
- **Modèles pré-entraînés** du notebook `3_modele_avance.py`

## 🔧 Installation locale

### 1. Cloner le repository

```bash
git clone <repository-url>
cd google_air-paradis-api
```

### 2. Créer un environnement virtuel

```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows
```

### 3. Installer les dépendances

```bash
# Pour le développement local Windows
pip install -r requirements-windows.txt

# Pour déploiement Linux/Docker
pip install -r requirements.txt
```

### 4. Copier les modèles

Placez les fichiers de modèles dans le dossier `models/` :
- `best_advanced_model_BiLSTM_Word2Vec.h5`
- `best_advanced_model_tokenizer.pickle`
- `best_advanced_model_config.pickle`

### 5. Démarrer MLflow (dans un terminal séparé)

```bash
mlflow ui --host 0.0.0.0 --port 5000
```

MLflow sera accessible à : http://localhost:5000

### 6. Lancer l'API

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

L'API sera accessible à : http://localhost:8000

## ☁️ Déploiement sur Google Cloud

### Étape 1 : Configuration du projet Google Cloud

1. **Créer un projet Google Cloud** :
   - Aller sur [Google Cloud Console](https://console.cloud.google.com)
   - Créer un nouveau projet : `air-paradis-sentiment`

2. **Activer les APIs nécessaires** :
   ```bash
   gcloud services enable run.googleapis.com
   gcloud services enable artifactregistry.googleapis.com
   gcloud services enable monitoring.googleapis.com
   gcloud services enable logging.googleapis.com
   ```

3. **Créer un Artifact Registry** :
   ```bash
   gcloud artifacts repositories create air-paradis-registry \
     --repository-format=docker \
     --location=europe-west1
   ```

### Étape 2 : Configuration des secrets GitHub

Dans votre repository GitHub, aller dans **Settings > Secrets and variables > Actions** et ajouter :

- `GCP_SA_KEY` : Clé JSON du compte de service Google Cloud avec les permissions :
  - Cloud Run Admin
  - Artifact Registry Admin
  - Monitoring Admin
  - Logging Admin

### Étape 3 : Déploiement via GitHub Actions

1. **Push vers la branche main** :
   ```bash
   git add .
   git commit -m "Deploy Air Paradis Sentiment API"
   git push origin main
   ```

2. **Vérifier le déploiement** :
   - Aller dans l'onglet **Actions** de votre repository GitHub
   - Vérifier que le pipeline s'exécute sans erreur

### Étape 4 : Vérification du déploiement

Une fois déployé, l'API sera accessible via l'URL Cloud Run :
```
https://air-paradis-sentiment-api-[hash]-ew.a.run.app
```

Test de santé :
```bash
curl https://your-service-url/health
```

## 📊 Configuration MLflow

### Démarrage local de MLflow

```bash
# Dans le dossier du projet
mlflow ui --host 0.0.0.0 --port 5000
```

### Accès aux expérimentations

- **Interface MLflow** : http://localhost:5000
- **Expériment** : `air_paradis_sentiment_production`
- **Modèles trackés** : Chaque prédiction et feedback est automatiquement enregistré

### Exemple de tracking

```python
with mlflow.start_run(run_name="prediction_example"):
    mlflow.log_param("text_length", len(text))
    mlflow.log_metric("confidence", confidence)
    mlflow.log_param("sentiment", sentiment)
```

## 📈 Monitoring et alertes

### Google Cloud Monitoring

L'API utilise **Google Cloud Logging** et **Google Cloud Monitoring** pour :

1. **Logs structurés** :
   - Prédictions réussies
   - Erreurs de prédiction
   - Feedback utilisateur

2. **Métriques personnalisées** :
   - Nombre d'erreurs
   - Temps de réponse
   - Feedback de qualité

3. **Alertes automatiques** :
   - Email envoyé à `berchet.thomas@gmail.com`
   - Déclenchement : 3 erreurs en 5 minutes

### Configuration des alertes

Les alertes sont automatiquement configurées dans le code. Pour personnaliser :

```python
# Dans monitoring/gcp_monitor.py
self.error_threshold = 3  # Nombre d'erreurs
self.time_window_minutes = 5  # Fenêtre de temps
self.alert_email = "votre-email@example.com"
```

## 🧪 Tests

### Lancer les tests unitaires

```bash
python -m pytest tests/ -v
```

### Tests avec couverture

```bash
pip install coverage
coverage run -m pytest tests/
coverage report -m
```

### Tests d'intégration

```bash
# Test de l'API locale
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{"text": "I love Air Paradis, great service!"}'
```

## 🔌 API Endpoints

### GET `/` - Informations de l'API
```json
{
  "message": "Air Paradis Sentiment Analysis API",
  "version": "1.0.0",
  "model": "BiLSTM_Word2Vec",
  "endpoints": {...}
}
```

### GET `/health` - Santé de l'API
```json
{
  "status": "healthy",
  "model_loaded": true,
  "timestamp": "2024-01-01T12:00:00",
  "version": "1.0.0"
}
```

### POST `/predict` - Prédiction de sentiment

**Request:**
```json
{
  "text": "I had an amazing flight with Air Paradis!",
  "user_id": "optional_user_id"
}
```

**Response:**
```json
{
  "text": "I had an amazing flight with Air Paradis!",
  "sentiment": "positive",
  "confidence": 0.8542,
  "probability": 0.8542,
  "model": "BiLSTM_Word2Vec",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "request_id": "req_20240101_120000_123456"
}
```

### POST `/feedback` - Feedback utilisateur

**Request:**
```json
{
  "text": "Great service!",
  "predicted_sentiment": "positive",
  "actual_sentiment": "positive",
  "is_correct": true,
  "user_id": "optional_user_id"
}
```

**Response:**
```json
{
  "message": "Feedback enregistré avec succès",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### GET `/metrics` - Métriques de l'API
```json
{
  "total_errors": 0,
  "recent_errors_5min": 0,
  "model_loaded": true,
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## 🔄 Pipeline CI/CD

Le pipeline GitHub Actions inclut :

1. **Tests automatiques** :
   - Tests unitaires avec pytest
   - Validation du code
   - Couverture de tests

2. **Build Docker** :
   - Construction de l'image Docker
   - Push vers Google Artifact Registry

3. **Déploiement** :
   - Déploiement automatique sur Google Cloud Run
   - Test de santé post-déploiement

4. **Notifications** :
   - Statut de déploiement
   - URL de l'API déployée

## 🚀 Utilisation

### Test rapide avec curl

```bash
# Prédiction de sentiment
curl -X POST "https://your-api-url/predict" \
  -H "Content-Type: application/json" \
  -d '{"text": "Air Paradis has excellent customer service!"}'

# Feedback
curl -X POST "https://your-api-url/feedback" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Great flight!",
    "predicted_sentiment": "positive",
    "actual_sentiment": "positive",
    "is_correct": true
  }'
```

### Interface interactive

Documentation Swagger disponible à : `https://your-api-url/docs`

## 📝 Notes importantes

1. **Modèles requis** : Assurez-vous que les fichiers de modèles sont présents avant le déploiement
2. **Ressources Google Cloud** : L'API utilise Cloud Run avec 2GB RAM et 1 CPU
3. **Limitations** : Texte maximum de 500 caractères par prédiction
4. **Sécurité** : L'API est publique pour les tests, configurez l'authentification en production
5. **Coûts** : Surveillez l'utilisation Google Cloud pour éviter les frais inattendus

## 🆘 Dépannage

### Erreurs courantes

1. **Modèle non trouvé** :
   - Vérifier que les fichiers sont dans `models/`
   - Vérifier les permissions de lecture

2. **Erreur MLflow** :
   - Vérifier que MLflow UI est démarré
   - Vérifier la variable `MLFLOW_TRACKING_URI`

3. **Erreur Google Cloud** :
   - Vérifier les permissions du compte de service
   - Vérifier que les APIs sont activées

### Logs

```bash
# Logs locaux
uvicorn app.main:app --log-level debug

# Logs Google Cloud
gcloud logs read "resource.type=cloud_run_revision" --limit=50
```

## 👥 Contribution

Pour contribuer au projet :

1. Fork le repository
2. Créer une branche feature
3. Commiter les changements
4. Créer une Pull Request

---

**🎯 Projet réalisé dans le cadre du cursus Data Scientist - OpenClassrooms**

*API d'analyse de sentiment pour Air Paradis - MLOps Pipeline*
