## 🔗 **Liens du projet Air Paradis Sentiment Analysis**

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