# Makefile pour Air Paradis Sentiment API
# Automatise les tâches courantes de développement et déploiement

.PHONY: help install setup dev test test-api clean build docker deploy status logs

# Variables
PYTHON := python
PIP := pip
UVICORN := uvicorn
DOCKER := docker
GCLOUD := gcloud

PROJECT_ID := air-paradis-sentiment
REGION := europe-west1
SERVICE_NAME := air-paradis-sentiment-api
REGISTRY_NAME := air-paradis-registry

# Couleurs pour l'affichage
BLUE := \033[36m
GREEN := \033[32m
YELLOW := \033[33m
RED := \033[31m
RESET := \033[0m

help: ## Affiche l'aide
	@echo "$(BLUE)Air Paradis Sentiment API - Makefile$(RESET)"
	@echo "=========================================="
	@echo ""
	@echo "$(GREEN)Commandes disponibles:$(RESET)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(YELLOW)%-15s$(RESET) %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Installe les dépendances TensorFlow 2.13
	@echo "$(BLUE)📦 Installation des dépendances TensorFlow 2.13...$(RESET)"
	$(PIP) install --upgrade pip
	$(PIP) install typing-extensions==4.5.0
	$(PIP) install tensorflow==2.13.0
	$(PIP) install -r requirements.txt
	@echo "$(GREEN)✅ Dépendances installées$(RESET)"

install-step-by-step: ## Installation étape par étape pour éviter les conflits
	@echo "$(BLUE)🛠️  Installation étape par étape...$(RESET)"
	$(PYTHON) install_clean.py

install-ultra-compatible: ## Installation avec versions ultra-compatibles
	@echo "$(BLUE)🔧 Installation versions ultra-compatibles...$(RESET)"
	$(PIP) uninstall -y tensorflow tensorflow-intel fastapi uvicorn pydantic mlflow
	$(PIP) cache purge
	$(PIP) install -r requirements-ultra-compatible.txt
	@echo "$(GREEN)✅ Installation ultra-compatible terminée$(RESET)"

install-minimal: ## Installation minimale pour tests
	@echo "$(BLUE)🤔 Installation minimale...$(RESET)"
	$(PIP) install tensorflow==2.13.0 numpy==1.24.3
	$(PIP) install fastapi==0.95.2 uvicorn==0.22.0 pydantic==1.10.8
	$(PIP) install requests==2.31.0
	@echo "$(GREEN)✅ Installation minimale terminée$(RESET)"

test-install: ## Teste l'installation des dépendances
	@echo "$(BLUE)🧪 Test d'installation...$(RESET)"
	$(PYTHON) test_installation.py

fix-conflicts: ## Résout les conflits pour TensorFlow 2.13 + batch_shape
	@echo "$(BLUE)🔧 Résolution des conflits TensorFlow 2.13...$(RESET)"
	$(PIP) uninstall -y tensorflow tensorflow-intel fastapi uvicorn pydantic mlflow
	$(PIP) install typing-extensions==4.5.0
	$(PIP) install tensorflow==2.13.0
	$(PIP) install fastapi==0.100.1 uvicorn[standard]==0.23.2
	$(PIP) install pydantic==1.10.13
	$(PIP) install mlflow==2.7.1
	$(PIP) install -r requirements.txt
	@echo "$(GREEN)✅ Conflits résolus pour TensorFlow 2.13$(RESET)"

setup: install ## Configuration complète de l'environnement
	@echo "$(BLUE)🔧 Configuration de l'environnement...$(RESET)"
	$(PYTHON) test_installation.py
	$(PYTHON) setup_mlflow.py
	@if [ ! -f models/best_advanced_model_BiLSTM_Word2Vec.h5 ]; then \
		echo "$(YELLOW)⚠️  Modèles manquants, création de fichiers factices...$(RESET)"; \
		$(PYTHON) create_pickle_files.py; \
	fi
	@echo "$(GREEN)✅ Environnement configuré$(RESET)"

dev: setup ## Lance l'environnement de développement
	@echo "$(BLUE)🚀 Démarrage de l'environnement de développement...$(RESET)"
	$(PYTHON) start_dev.py

dev-api-no-mlflow: ## Lance l'API sans MLflow (évite les problèmes pyarrow)
	@echo "$(BLUE)🚀 Démarrage API sans MLflow (vos modèles réels)...$(RESET)"
	$(UVICORN) app.main_no_mlflow:app --host 0.0.0.0 --port 8000 --reload

dev-api-simple: ## Lance l'API simplifiée (versions anciennes)
	@echo "$(BLUE)🚀 Démarrage de l'API simplifiée...$(RESET)"
	$(UVICORN) app.main_simple:app --host 0.0.0.0 --port 8000 --reload

dev-api: ## Lance l'API complète (avec MLflow)
	@echo "$(BLUE)🚀 Démarrage de l'API complète...$(RESET)"
	$(UVICORN) app.main:app --host 0.0.0.0 --port 8000 --reload

dev-mlflow: ## Lance uniquement MLflow UI
	@echo "$(BLUE)📊 Démarrage de MLflow UI...$(RESET)"
	mlflow ui --host 0.0.0.0 --port 5000

test: ## Lance les tests unitaires
	@echo "$(BLUE)🧪 Lancement des tests unitaires...$(RESET)"
	$(PYTHON) -m pytest tests/ -v --tb=short

test-coverage: ## Lance les tests avec couverture
	@echo "$(BLUE)🧪 Tests avec couverture...$(RESET)"
	$(PIP) install coverage
	coverage run -m pytest tests/
	coverage report -m
	coverage html
	@echo "$(GREEN)📊 Rapport de couverture: htmlcov/index.html$(RESET)"

test-models: ## Teste le chargement des modèles réels
	@echo "$(BLUE)🧪 Test des modèles réels TensorFlow 2.13...$(RESET)"
	@if [ -f models/best_advanced_model_BiLSTM_Word2Vec.h5 ]; then \
		echo "$(GREEN)✅ Modèle .h5 trouvé$(RESET)"; \
		$(PYTHON) -c "from app.main import ModelManager; import asyncio; m = ModelManager(); asyncio.run(m.load_model())"; \
	else \
		echo "$(YELLOW)⚠️  Modèle .h5 manquant - utilisation du mode factice$(RESET)"; \
	fi

test-batch-shape: ## Teste la compatibilité batch_shape
	@echo "$(BLUE)🔍 Test compatibilité batch_shape...$(RESET)"
	@$(PYTHON) -c "\
	import tensorflow as tf; \
	print(f'TensorFlow version: {tf.__version__}'); \
	try: \
		from tensorflow.keras.layers import InputLayer; \
		layer = InputLayer(batch_input_shape=(64, 50)); \
		print('OK  batch_input_shape supporte'); \
	except Exception as e: \
		print(f'ERR batch_input_shape: {e}'); \
	"

test-api: ## Teste l'API locale
	@echo "$(BLUE)🔗 Test de l'API locale...$(RESET)"
	$(PYTHON) test_api.py --url http://localhost:8000

test-no-mlflow: ## Teste l'API sans MLflow
	@echo "$(BLUE)🧪 Test API sans MLflow...$(RESET)"
	$(PYTHON) test_api.py --url http://localhost:8000

fix-pyarrow: ## Corrige le problème pyarrow
	@echo "$(BLUE)🔧 Correction du problème pyarrow...$(RESET)"
	$(PIP) install pyarrow --only-binary=pyarrow
	$(PIP) install mlflow==2.7.1
	@echo "$(GREEN)✅ pyarrow installé (version pré-compilée)$(RESET)"

test-api-prod: ## Teste l'API en production
	@echo "$(BLUE)🌐 Test de l'API en production...$(RESET)"
	@if [ -z "$(API_URL)" ]; then \
		echo "$(RED)❌ Définissez API_URL: make test-api-prod API_URL=https://your-api-url$(RESET)"; \
		exit 1; \
	fi
	$(PYTHON) test_api.py --url $(API_URL) --production

lint: ## Vérifie le code avec flake8
	@echo "$(BLUE)🔍 Vérification du code...$(RESET)"
	$(PIP) install flake8
	flake8 app/ tests/ --max-line-length=100 --ignore=E402,W503

format: ## Formate le code avec black
	@echo "$(BLUE)✨ Formatage du code...$(RESET)"
	$(PIP) install black
	black app/ tests/ --line-length=100

clean: ## Nettoie les fichiers temporaires
	@echo "$(BLUE)🧹 Nettoyage...$(RESET)"
	find . -type f -name "*.pyc" -delete
	find . -type d -name "__pycache__" -delete
	find . -type d -name "*.egg-info" -exec rm -rf {} +
	find . -type d -name ".pytest_cache" -exec rm -rf {} +
	rm -rf htmlcov/
	rm -rf .coverage
	@echo "$(GREEN)✅ Nettoyage terminé$(RESET)"

build: ## Construit l'image Docker
	@echo "$(BLUE)🐳 Construction de l'image Docker...$(RESET)"
	$(DOCKER) build -t $(SERVICE_NAME):latest .
	@echo "$(GREEN)✅ Image Docker construite$(RESET)"

docker-run: build ## Lance l'API avec Docker
	@echo "$(BLUE)🐳 Lancement avec Docker...$(RESET)"
	$(DOCKER) run --rm -p 8000:8000 \
		-e GOOGLE_CLOUD_PROJECT=$(PROJECT_ID) \
		-e GOOGLE_CLOUD_REGION=$(REGION) \
		$(SERVICE_NAME):latest

docker-test: ## Teste l'API Docker
	@echo "$(BLUE)🧪 Test de l'API Docker...$(RESET)"
	sleep 5  # Attendre que le conteneur soit prêt
	$(PYTHON) test_api.py --url http://localhost:8000

deploy-setup: ## Configure Google Cloud pour le déploiement
	@echo "$(BLUE)☁️  Configuration Google Cloud...$(RESET)"
	$(GCLOUD) config set project $(PROJECT_ID)
	$(GCLOUD) services enable run.googleapis.com
	$(GCLOUD) services enable artifactregistry.googleapis.com
	$(GCLOUD) services enable monitoring.googleapis.com
	$(GCLOUD) services enable logging.googleapis.com
	@echo "$(GREEN)✅ Google Cloud configuré$(RESET)"

deploy: ## Déploie sur Google Cloud
	@echo "$(BLUE)🚀 Déploiement sur Google Cloud...$(RESET)"
	$(PYTHON) deploy_gcp.py --project $(PROJECT_ID) --region $(REGION)

deploy-check: ## Vérifie l'état du déploiement
	@echo "$(BLUE)🔍 Vérification du déploiement...$(RESET)"
	$(GCLOUD) run services describe $(SERVICE_NAME) --region $(REGION) --format="table(status.url,status.conditions)"

status: ## Affiche le statut des services
	@echo "$(BLUE)📊 Statut des services$(RESET)"
	@echo "================================"
	@echo "$(YELLOW)Local:$(RESET)"
	@curl -s http://localhost:8000/health 2>/dev/null | jq . || echo "  ❌ API locale indisponible"
	@curl -s http://localhost:5000 2>/dev/null >/dev/null && echo "  ✅ MLflow UI disponible" || echo "  ❌ MLflow UI indisponible"
	@echo ""
	@echo "$(YELLOW)Google Cloud:$(RESET)"
	@$(GCLOUD) run services list --filter="metadata.name=$(SERVICE_NAME)" --format="table(metadata.name,status.url,status.conditions[0].type)" 2>/dev/null || echo "  ❌ Service non déployé"

logs: ## Affiche les logs locaux et cloud
	@echo "$(BLUE)📋 Logs$(RESET)"
	@echo "========"
	@echo "$(YELLOW)Logs Google Cloud (dernières 20 lignes):$(RESET)"
	$(GCLOUD) logs read "resource.type=cloud_run_revision AND resource.labels.service_name=$(SERVICE_NAME)" --limit=20 --format="table(timestamp,severity,textPayload)" || echo "Aucun log trouvé"

logs-follow: ## Suit les logs en temps réel
	@echo "$(BLUE)📋 Suivi des logs Google Cloud...$(RESET)"
	$(GCLOUD) logs tail "resource.type=cloud_run_revision AND resource.labels.service_name=$(SERVICE_NAME)" --format="table(timestamp,severity,textPayload)"

urls: ## Affiche les URLs importantes
	@echo "$(BLUE)🔗 URLs importantes$(RESET)"
	@echo "====================="
	@echo "$(YELLOW)Local:$(RESET)"
	@echo "  API:           http://localhost:8000"
	@echo "  Documentation: http://localhost:8000/docs"
	@echo "  Santé:         http://localhost:8000/health"
	@echo "  MLflow:        http://localhost:5000"
	@echo ""
	@echo "$(YELLOW)Production:$(RESET)"
	@SERVICE_URL=$$($(GCLOUD) run services describe $(SERVICE_NAME) --region $(REGION) --format="value(status.url)" 2>/dev/null); \
	if [ -n "$$SERVICE_URL" ]; then \
		echo "  API:           $$SERVICE_URL"; \
		echo "  Documentation: $$SERVICE_URL/docs"; \
		echo "  Santé:         $$SERVICE_URL/health"; \
	else \
		echo "  ❌ Service non déployé"; \
	fi

backup: ## Sauvegarde les modèles et configurations
	@echo "$(BLUE)💾 Sauvegarde...$(RESET)"
	@mkdir -p backup/$(shell date +%Y%m%d_%H%M%S)
	@if [ -d models ]; then cp -r models backup/$(shell date +%Y%m%d_%H%M%S)/; fi
	@if [ -d config ]; then cp -r config backup/$(shell date +%Y%m%d_%H%M%S)/; fi
	@if [ -d mlruns ]; then cp -r mlruns backup/$(shell date +%Y%m%d_%H%M%S)/; fi
	@echo "$(GREEN)✅ Sauvegarde créée dans backup/$(RESET)"

requirements: ## Met à jour requirements.txt
	@echo "$(BLUE)📝 Mise à jour de requirements.txt...$(RESET)"
	$(PIP) freeze > requirements.txt
	@echo "$(GREEN)✅ requirements.txt mis à jour$(RESET)"

init: ## Initialise un nouveau projet
	@echo "$(BLUE)🎯 Initialisation du projet...$(RESET)"
	@if [ ! -d .git ]; then \
		git init; \
		echo "$(GREEN)✅ Repository Git initialisé$(RESET)"; \
	fi
	@if [ ! -f .env ]; then \
		cp .env.example .env; \
		echo "$(GREEN)✅ Fichier .env créé$(RESET)"; \
	fi
	$(MAKE) setup
	@echo "$(GREEN)🎉 Projet initialisé avec succès!$(RESET)"

# Tâches de CI/CD
ci-test: ## Tests pour CI/CD
	@echo "$(BLUE)🤖 Tests CI/CD...$(RESET)"
	$(PYTHON) -m pytest tests/ -v --tb=short --maxfail=1
	$(PYTHON) test_api.py --url http://localhost:8000

ci-build: ## Build pour CI/CD
	@echo "$(BLUE)🤖 Build CI/CD...$(RESET)"
	$(DOCKER) build -t $(SERVICE_NAME):ci .
	@echo "$(GREEN)✅ Build CI/CD terminé$(RESET)"

# Aide par défaut
.DEFAULT_GOAL := help
