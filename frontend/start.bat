@echo off
echo 🚀 Démarrage de l'interface Air Paradis Sentiment Analysis
echo ==============================================

:: Vérification de Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js n'est pas installé. Veuillez l'installer d'abord.
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version

:: Vérification du fichier package.json
if not exist "package.json" (
    echo ❌ Fichier package.json non trouvé. Vous devez être dans le dossier frontend.
    pause
    exit /b 1
)

:: Installation des dépendances si nécessaire
if not exist "node_modules" (
    echo 📦 Installation des dépendances...
    npm install
)

:: Copie du fichier d'environnement si nécessaire
if not exist ".env.local" (
    if exist ".env.example" (
        echo 📋 Copie du fichier d'environnement...
        copy .env.example .env.local
        echo ⚠️  N'oubliez pas de configurer votre .env.local avec l'URL de votre API
    )
)

echo.
echo 🔥 Démarrage du serveur de développement...
echo Interface accessible sur: http://localhost:3000
echo.

npm run dev

pause
