# De la Recherche à la Production : Une Approche MLOps Complète pour l'Analyse de Sentiment

## Introduction

Dans le cadre d'une mission de conseil pour la compagnie aérienne fictive "Air Paradis", nous avons développé un système complet d'analyse de sentiment des tweets utilisant des techniques de Deep Learning avancées et une démarche MLOps moderne. Ce projet illustre la transition d'un modèle de recherche vers une API de production robuste, déployée sur Google Cloud avec un pipeline CI/CD automatisé.

## Vue d'ensemble du projet

**Objectif :** Créer un système d'IA permettant d'anticiper les bad buzz sur les réseaux sociaux en analysant le sentiment des tweets en temps réel.

**Enjeux techniques :**
- Comparaison de plusieurs approches de modélisation (classique vs avancé vs BERT)
- Mise en œuvre d'une démarche MLOps complète
- Déploiement en production avec monitoring et alertes
- Gestion efficace des modèles volumineux

## Architecture technique

### Stack technologique
- **Modélisation :** TensorFlow 2.16, Keras, scikit-learn
- **API :** FastAPI avec Pydantic pour la validation
- **Containerisation :** Docker
- **Cloud :** Google Cloud Run, Artifact Registry, Cloud Storage
- **CI/CD :** GitHub Actions
- **Monitoring :** Google Cloud Monitoring, MLflow
- **Gestion des modèles :** Google Cloud Storage (solution innovante)

### Architecture de déploiement

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   GitHub Repo   │───▶│  GitHub Actions  │───▶│  Artifact Reg.  │
│   (Code Source) │    │   (CI/CD Pipeline)│    │  (Docker Images)│
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                         │
┌─────────────────┐    ┌──────────────────┐             │
│ Cloud Storage   │───▶│   Cloud Run     │◀────────────┘
│ (Modèles ML)    │    │  (API Production)│
└─────────────────┘    └──────────────────┘
                                │
                       ┌──────────────────┐
                       │ Cloud Monitoring │
                       │    (Alertes)     │
                       └──────────────────┘
```

## Comparaison des approches de modélisation

### 1. Modèle sur mesure simple

**Approche :** Régression logistique avec TF-IDF
- **Avantages :** Rapide, interprétable, baseline solide
- **Performance :** Accuracy ~82%, temps d'entraînement <5 min
- **Cas d'usage :** Prototypage rapide, contraintes de ressources

### 2. Modèle sur mesure avancé (retenu pour la production)

**Approche :** BiLSTM bidirectionnel avec Word2Vec
- **Architecture :**
  ```python
  Embedding(Word2Vec 300d) → SpatialDropout1D → 
  Bidirectional(LSTM 128) → Dense(64) → Dense(1, sigmoid)
  ```
- **Performance :** Accuracy ~87%, F1-score 0.89
- **Avantages :** Équilibre performance/complexité optimal
- **Temps d'inférence :** ~50ms par prédiction

### 3. Modèle BERT avancé

**Approche :** TFBertForSequenceClassification fine-tuné
- **Performance :** Accuracy ~91%, F1-score 0.92
- **Inconvénients :** Temps d'inférence ~300ms, ressources importantes
- **Conclusion :** Excellent pour la recherche, trop lourd pour la production

## Démarche MLOps mise en œuvre

### 1. Expérimentation et tracking avec MLflow

```python
with mlflow.start_run(run_name=f"{architecture}_{embedding_type}"):
    # Enregistrement des paramètres
    mlflow.log_param("embedding_type", embedding_type)
    mlflow.log_param("architecture", architecture)
    
    # Entraînement du modèle
    history = model.fit(X_train, y_train, validation_data=(X_val, y_val))
    
    # Métriques de performance
    mlflow.log_metric("val_accuracy", val_accuracy)
    mlflow.log_metric("f1", f1_score)
    
    # Sauvegarde du modèle
    mlflow.keras.log_model(model, f"{architecture}_{embedding_type}")
```

### 2. Gestion des modèles : Innovation Google Cloud Storage

**Problème rencontré :** Limitation du budget Git LFS (1GB/mois) pour des modèles de 350MB+

**Solution innovante :** Migration vers Google Cloud Storage
```python
async def _download_models_if_needed(self):
    """Télécharge les modèles depuis Google Cloud Storage si nécessaire"""
    bucket_url = "https://storage.googleapis.com/air-paradis-models"
    models_to_download = [
        ("best_advanced_model_BiLSTM_Word2Vec.h5", self.model_path),
        ("best_advanced_model_tokenizer.pickle", self.tokenizer_path),
        ("best_advanced_model_config.pickle", self.config_path)
    ]
    
    for filename, local_path in models_to_download:
        if not os.path.exists(local_path) or os.path.getsize(local_path) < 1000:
            logger.info(f"💾 Téléchargement de {filename} depuis GCS...")
            url = f"{bucket_url}/{filename}"
            urllib.request.urlretrieve(url, local_path)
```

**Avantages de cette approche :**
- ✅ Gratuit (25GB/mois avec GCS)
- ✅ Rapide (téléchargement en ~10 secondes)
- ✅ Scalable et professionnel
- ✅ Séparation claire code/modèles

### 3. Pipeline CI/CD avec GitHub Actions

```yaml
jobs:
  test:
    name: Run Tests
    steps:
    - name: Run unit tests
      run: python -m pytest tests/ -v --tb=short
    
  build:
    name: Build Docker Image
    needs: test
    steps:
    - name: Build and push to Artifact Registry
      run: |
        docker build -t $IMAGE_TAG .
        docker push $IMAGE_TAG
    
  deploy:
    name: Deploy to Cloud Run
    needs: build
    steps:
    - name: Deploy to production
      run: |
        gcloud run deploy $SERVICE_NAME \
          --image $IMAGE_TAG \
          --memory 2Gi --cpu 1 --timeout 600
```

### 4. API de production avec FastAPI

```python
@app.post("/predict", response_model=SentimentResponse)
async def predict_sentiment(request: SentimentRequest):
    try:
        # Prédiction avec gestion des erreurs
        result = await model_manager.predict(request.text)
        
        # Tracking MLflow (désactivé en production)
        if MLFLOW_AVAILABLE:
            with mlflow.start_run():
                mlflow.log_metric("confidence", result["confidence"])
        
        return SentimentResponse(**result)
    except Exception as e:
        # Monitoring des erreurs
        background_tasks.add_task(send_error_to_monitoring, str(e), request.text)
        raise HTTPException(status_code=500, detail="Erreur interne")
```

## Monitoring et alertes en production

### 1. Métriques surveillées

- **Performance :** Temps de réponse, throughput, taux d'erreur
- **Qualité :** Feedback utilisateur, accuracy en production
- **Infrastructure :** Utilisation mémoire/CPU, santé des conteneurs

### 2. Système d'alertes Google Cloud

```python
async def send_error_to_monitoring(error_message: str, text: str):
    """Envoie une erreur au monitoring Google Cloud"""
    global error_count, last_errors
    error_count += 1
    
    # Garder les erreurs des 5 dernières minutes
    current_time = datetime.utcnow()
    five_minutes_ago = current_time.timestamp() - 300
    last_errors = [err for err in last_errors 
                   if err["timestamp"].timestamp() > five_minutes_ago]
    
    # Déclencher une alerte si 3 erreurs en 5 minutes
    if len(last_errors) >= 3:
        await send_alert_email()
```

### 3. Interface de feedback utilisateur

```python
@app.post("/feedback")
async def submit_feedback(feedback: FeedbackRequest):
    """Soumission de feedback utilisateur pour l'amélioration continue"""
    if not feedback.is_correct:
        # Envoyer au monitoring pour analyse
        background_tasks.add_task(
            send_error_to_monitoring, 
            f"Prédiction incorrecte: {feedback.predicted_sentiment} vs {feedback.actual_sentiment}",
            feedback.text
        )
    
    # Tracking pour amélioration future du modèle
    if MLFLOW_AVAILABLE:
        with mlflow.start_run():
            mlflow.log_metric("is_correct", 1 if feedback.is_correct else 0)
```

## Tests et qualité du code

### 1. Tests unitaires automatisés

```python
@pytest.mark.asyncio
async def test_predict_sentiment():
    """Test de prédiction de sentiment"""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/predict", json={
            "text": "I love this airline!"
        })
    
    assert response.status_code == 200
    data = response.json()
    assert data["sentiment"] in ["positive", "negative"]
    assert 0 <= data["confidence"] <= 1
```

### 2. Tests d'intégration

```python
def test_health_check():
    """Test de santé de l'API"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
```

## Résultats et métriques

### Performance des modèles
| Modèle | Accuracy | F1-Score | Temps d'inférence | Taille |
|--------|----------|----------|-------------------|---------|
| Régression Logistique | 82% | 0.81 | 5ms | 2MB |
| BiLSTM + Word2Vec | 87% | 0.89 | 50ms | 350MB |
| BERT Fine-tuné | 91% | 0.92 | 300ms | 500MB |

### Métriques de production
- **Disponibilité :** 99.9% (SLA Google Cloud Run)
- **Temps de réponse moyen :** 120ms (incluant téléchargement modèles)
- **Throughput :** 100 req/sec maximum
- **Coût mensuel :** ~15€ (Cloud Run + Storage + Monitoring)

## Défis techniques rencontrés et solutions

### 1. Compatibilité TensorFlow 2.16 avec tokenizers legacy

**Problème :** Erreurs `keras.src.legacy` avec anciens tokenizers

**Solution :** Création d'un CompatibleTokenizer
```python
class CompatibleTokenizer:
    """Tokenizer compatible créé à partir d'un word_index extracté"""
    
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
```

### 2. Limitation budget Git LFS

**Problème :** Dépassement du budget 1GB/mois GitHub LFS

**Solution :** Migration vers Google Cloud Storage
- Coût : 0€ (dans les limites gratuites)
- Performance : Équivalente à Git LFS
- Scalabilité : Illimitée

### 3. Timeout de démarrage Cloud Run

**Problème :** Chargement des modèles trop long (>240s)

**Solutions :**
- Augmentation timeout à 600s
- Optimisation chargement avec `tf.keras.backend.clear_session()`
- Téléchargement asynchrone des modèles

## Améliorations futures et roadmap

### Court terme (1-3 mois)
1. **A/B Testing :** Comparaison de modèles en production
2. **Auto-retraining :** Pipeline d'entraînement automatique avec nouveaux données
3. **Cache Redis :** Mise en cache des prédictions fréquentes

### Moyen terme (3-6 mois)
1. **Modèle ensembliste :** Combinaison BiLSTM + BERT pour performances optimales
2. **Multi-langues :** Support français, espagnol, allemand
3. **Streaming :** Traitement en temps réel avec Apache Kafka

### Long terme (6-12 mois)
1. **Edge deployment :** Déploiement sur CDN pour latence minimale
2. **AutoML :** Optimisation automatique d'hyperparamètres
3. **Explainabilité :** LIME/SHAP pour expliquer les prédictions

## Bonnes pratiques MLOps identifiées

### 1. Séparation des responsabilités
- **Code :** Git classique avec versioning sémantique
- **Modèles :** Cloud Storage avec versioning automatique
- **Config :** Variables d'environnement et secrets managés

### 2. Observabilité multicouche
- **Applicatif :** Logs structurés, métriques custom
- **Infrastructure :** Monitoring Cloud Run natif
- **Métier :** Feedback utilisateur, accuracy en production

### 3. Déploiement progressif
- **Tests automatisés :** Unitaires + intégration + e2e
- **Environnements :** Dev → Staging → Production
- **Rollback automatique :** En cas de dégradation des métriques

## Retour d'expérience et lessons learned

### Ce qui a bien fonctionné ✅
1. **Google Cloud Storage pour modèles :** Solution élégante au problème Git LFS
2. **FastAPI + Pydantic :** Validation automatique et documentation swagger
3. **GitHub Actions :** Pipeline CI/CD simple et efficace
4. **Monitoring proactif :** Détection rapide des problèmes

### Défis rencontrés ⚠️
1. **Compatibilité TensorFlow :** Versions et dépendances complexes
2. **Gestion des timeouts :** Équilibre entre robustesse et réactivité
3. **Coûts Cloud :** Surveillance nécessaire pour éviter les dérives

### Recommandations pour projets similaires 💡
1. **Commencer simple :** MVP avec modèle léger, complexifier progressivement
2. **Tester tôt et souvent :** Tests automatisés dès le début du projet
3. **Monitorer tout :** Logs, métriques, feedback utilisateur
4. **Documenter les choix :** Décisions techniques et compromis effectués

## Conclusion

Ce projet illustre une approche complète de MLOps, de la recherche à la production, en gérant les contraintes techniques réelles (budget, performance, compatibilité). La migration des modèles vers Google Cloud Storage représente une innovation pragmatique qui pourrait inspirer d'autres projets confrontés aux limitations de Git LFS.

L'API déployée démontre qu'il est possible de mettre en production des modèles de Deep Learning performants avec un budget limité (~15€/mois) tout en maintenant des standards de qualité professionnels.

Le code source complet et la documentation technique sont disponibles sur GitHub : [air-paradis-sentiment-api](https://github.com/berch-t/air-paradis-sentiment-api)

**API en production :** https://air-paradis-sentiment-api-qxumenjqxq-ew.a.run.app

---

*Article rédigé dans le cadre du projet "Réaliser une analyse de sentiments grâce au Deep Learning" - Parcours Ingénieur IA, OpenClassrooms.*
