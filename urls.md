## 🔗 **Liens du projet Air Paradis Sentiment Analysis**

- Les éléments sont déployés en "cold-start" : la première requête "réveille" l’API et nécessite de charger ou d’initialiser divers éléments (serveurs, caches, conteneurs, etc.), on pourra observer une latence d’environ 45 secondes. Une fois en mémoire et "réchauffée", l’API peut répondre presque instantanément aux requêtes suivantes !


### **🚀 APIs Déployées**
- **API Backend (FastAPI)** : https://air-paradis-sentiment-api-qxumenjqxq-ew.a.run.app
- **Frontend Interface** : https://air-paradis-frontend-qxumenjqxq-ew.a.run.app
- **Interface de Test** : https://air-paradis-frontend-qxumenjqxq-ew.a.run.app/test

### **📚 Endpoints API Backend**
- **Health Check** : https://air-paradis-sentiment-api-qxumenjqxq-ew.a.run.app/health
- **Predict** : https://air-paradis-sentiment-api-qxumenjqxq-ew.a.run.app/predict
- **Feedback** : https://air-paradis-sentiment-api-qxumenjqxq-ew.a.run.app/feedback
- **Logging** : https://air-paradis-sentiment-api-qxumenjqxq-ew.a.run.app/api/logging
- **Metrics** : https://air-paradis-sentiment-api-qxumenjqxq-ew.a.run.app/metrics
- **Documentation** : https://air-paradis-sentiment-api-qxumenjqxq-ew.a.run.app/docs

### **📁 Repository GitHub**
- **Repo** : https://github.com/berch-t/air-paradis-sentiment-api

### **☁️ Google Cloud Resources**
- **Project ID** : `air-paradis-sentiment-api`
- **Region** : `europe-west1`
- **Cloud Run Services** :
  - `air-paradis-sentiment-api` (Backend)
  - `air-paradis-frontend` (Frontend)

### **🧪 Tests rapides**
```bash
# Test API
curl https://air-paradis-sentiment-api-qxumenjqxq-ew.a.run.app/health

# Test prédiction
curl -X POST https://air-paradis-sentiment-api-qxumenjqxq-ew.a.run.app/predict -H "Content-Type: application/json" -d "{\"text\":\"I love this airline!\"}"
```