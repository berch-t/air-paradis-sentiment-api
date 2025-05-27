@echo off
cd /d "C:\Tonton\Projects\Python\claude-servers\google_air-paradis-api"

echo === COMMIT FINAL PROPRE ===
echo.

echo "Suppression des derniers fichiers de debug..."
del /f clean_deploy.bat 2>nul
del /f final_cleanup.bat 2>nul

echo.
echo "Commit de la suppression node_modules..."
git add -A
git commit -m "🧹 CLEANUP: Suppression complète node_modules de Git"

echo.
echo "Modification pour déclencher workflow..."
powershell -Command "(Get-Content frontend/package.json) -replace '1.0.1', '1.0.2' | Set-Content frontend/package.json"

echo.
echo "Commit du trigger..."
git add frontend/package.json
git commit -m "🚀 v1.0.2: Test build après cleanup node_modules"

echo.
echo "Push final..."
git push origin main

echo.
echo "=== DÉPLOIEMENT DÉCLENCHÉ ==="
echo "GitHub Actions va maintenant construire avec un environnement propre!"
echo "URL: https://github.com/berch-t/air-paradis-sentiment-api/actions"

pause
