#!/bin/bash

echo "🚀 Démarrage de l'interface Air Paradis Sentiment Analysis"
echo "=============================================="

# Vérification de Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Vérification du fichier package.json
if [ ! -f "package.json" ]; then
    echo "❌ Fichier package.json non trouvé. Vous devez être dans le dossier frontend."
    exit 1
fi

# Installation des dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
fi

# Copie du fichier d'environnement si nécessaire
if [ ! -f ".env.local" ] && [ -f ".env.example" ]; then
    echo "📋 Copie du fichier d'environnement..."
    cp .env.example .env.local
    echo "⚠️  N'oubliez pas de configurer votre .env.local avec l'URL de votre API"
fi

echo "🔥 Démarrage du serveur de développement..."
echo "Interface accessible sur: http://localhost:3000"
echo "API configurée sur: $(grep NEXT_PUBLIC_API_URL .env.local 2>/dev/null || echo 'Non configurée')"
echo ""

npm run dev
