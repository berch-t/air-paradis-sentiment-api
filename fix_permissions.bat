@echo off
cd /d "C:\Tonton\Projects\Python\claude-servers\google_air-paradis-api"

echo === CORRECTION WORKFLOW PERMISSIONS ===
echo.

echo "Commit de la correction du workflow..."
git add .github/workflows/deploy-frontend.yml
git commit -m "🔧 FIX: Correction noms PROJECT_ID et ARTIFACT_REGISTRY"

echo.
echo "Push..."
git push origin main

echo.
echo "=== WORKFLOW CORRIGÉ ==="
echo "Utilise maintenant:"
echo "- PROJECT_ID: air-paradis-sentiment"
echo "- ARTIFACT_REGISTRY: air-paradis-registry"
echo "- SERVICE_NAME: air-paradis-frontend"

pause
