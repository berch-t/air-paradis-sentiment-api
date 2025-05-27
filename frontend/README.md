# Air Paradis Sentiment Analysis UI

🎨 **Interface utilisateur Next.js ultra-moderne pour l'analyse de sentiment des tweets**

Cette interface constitue le frontend du **Projet 7 : "Réaliser une analyse de sentiments grâce au Deep Learning"** dans le cadre du parcours **Ingénieur IA** d'OpenClassrooms.

## ✨ Fonctionnalités

### 🚀 Interface Ultra-Moderne
- **Design dark** avec touches violettes et animations fluides
- **Particules animées** en arrière-plan avec effets glassmorphism
- **Animations Framer Motion** pour une expérience utilisateur premium
- **Responsive design** optimisé pour tous les écrans

### 🧠 Analyse de Sentiment
- **Saisie de tweets** avec exemples pré-remplis
- **Prédiction en temps réel** via l'API Google Cloud Run
- **Affichage des résultats** avec métriques détaillées :
  - Sentiment (positif/négatif) avec emoji
  - Niveau de confiance avec barre de progression
  - Probabilité et informations techniques

### 📊 Système de Feedback
- **Boutons de validation** : "Prédiction correcte" / "Prédiction incorrecte"
- **Logging Google Cloud** pour le monitoring en production
- **Animations de succès** pour confirmer l'envoi
- **Statistiques en temps réel** dans l'interface

### 🔍 Monitoring Intégré
- **Statut de l'API** en temps réel (en ligne/hors ligne)
- **Compteurs de prédictions** avec statistiques
- **Logs automatiques** vers Google Cloud pour alertes

## 🏗️ Architecture Technique

### Stack Frontend
- **Next.js 14** avec App Router
- **TypeScript** pour la sécurité des types
- **Tailwind CSS** pour le styling
- **Framer Motion** pour les animations
- **Lucide React** pour les icônes

### Composants Principaux
```
├── components/
│   ├── ui/              # Composants UI réutilisables
│   │   ├── button.tsx   # Bouton avec variants animés
│   │   ├── card.tsx     # Cartes glassmorphism
│   │   ├── input.tsx    # Champs de saisie
│   │   └── textarea.tsx # Zone de texte
│   ├── AnimatedHeader.tsx    # En-tête avec logo animé
│   ├── BackgroundParticles.tsx # Particules d'arrière-plan
│   ├── SentimentForm.tsx     # Formulaire d'analyse
│   └── SentimentResult.tsx   # Affichage des résultats
├── lib/
│   ├── api.ts          # Fonctions d'API et monitoring
│   └── utils.ts        # Utilitaires et helpers
└── app/
    ├── api/logging/    # Route API pour Google Cloud Logging
    ├── globals.css     # Styles globaux et animations
    ├── layout.tsx      # Layout principal
    └── page.tsx        # Page d'accueil
```

## 🚀 Installation et Démarrage

### Prérequis
- **Node.js 18+**
- **npm** ou **yarn**

### Installation

```bash
# Naviguer vers le dossier frontend
cd frontend

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env.local

# Modifier l'URL de l'API dans .env.local
NEXT_PUBLIC_API_URL=https://your-api-url.run.app
```

### Démarrage en Développement

```bash
# Lancer le serveur de développement
npm run dev

# L'interface sera accessible sur http://localhost:3000
```

### Build de Production

```bash
# Construire pour la production
npm run build

# Lancer en mode production
npm start
```

## 🔧 Configuration

### Variables d'Environnement

Créez un fichier `.env.local` avec :

```env
# URL de votre API déployée sur Google Cloud Run
NEXT_PUBLIC_API_URL=https://air-paradis-sentiment-api-qxumenjqxq-ew.a.run.app

# Configuration Google Cloud (optionnel)
NEXT_PUBLIC_GOOGLE_CLOUD_PROJECT=air-paradis-sentiment
NEXT_PUBLIC_MONITORING_ENABLED=true

# Environnement
NODE_ENV=development
```

### Personnalisation de l'API

Pour utiliser votre propre API, modifiez le fichier `lib/api.ts` :

```typescript
export const API_CONFIG = {
  BASE_URL: 'https://votre-api-url.run.app',
  // ... autres configurations
}
```

## 📱 Utilisation

### 1. Analyse de Sentiment

1. **Saisissez un tweet** dans la zone de texte
2. **Cliquez sur "Analyser le Sentiment"**
3. **Visualisez les résultats** avec confiance et métriques
4. **Donnez votre feedback** pour améliorer le modèle

### 2. Exemples Pré-remplis

Cliquez sur les exemples pour tester rapidement :
- "I absolutely love Air Paradis! Amazing crew! 😊"
- "Terrible experience, worst airline ever!"
- "Flight was okay, nothing special but arrived on time"
- "Outstanding customer service team!"

### 3. Feedback et Monitoring

- **Prédiction correcte** : Confirme la justesse du modèle
- **Prédiction incorrecte** : Envoie une alerte au monitoring
- **Statistiques** : Suivez vos analyses en temps réel

## 🎨 Design System

### Couleurs Principales

```css
/* Violet principal */
--primary: #a855f7;

/* Gradient de texte */
background: linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f59e0b 100%);

/* Glassmorphism */
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.1);
```

### Animations Personnalisées

- **Particules flottantes** : Animation continue des éléments de fond
- **Glassmorphism** : Effets de verre translucide
- **Transitions fluides** : Framer Motion pour tous les états
- **Effets de glow** : Illumination violette sur interaction

## 🔍 Monitoring et Alertes

### Système de Feedback

L'interface implémente un système de feedback complet :

```typescript
// Prédiction correcte
await logCorrectPrediction(text, sentiment, confidence)

// Prédiction incorrecte (déclenche alerte)
await logIncorrectPrediction(text, predicted, actual, confidence)
```

### Alertes Google Cloud

- **3 erreurs en 5 minutes** → Alerte automatique
- **Logs structurés** pour analyse
- **Métriques en temps réel** dans l'interface

## 🧪 Tests et Développement

### Tests de l'Interface

```bash
# Lancer en mode développement
npm run dev

# Tester avec différents types de tweets
# - Positifs : "I love this service!"
# - Négatifs : "Terrible experience!"
# - Neutres : "Flight was okay"
```

### Debug Mode

Activez les logs détaillés dans la console :

```typescript
// Dans lib/api.ts
console.log('API Response:', result)
console.log('Feedback sent:', feedbackData)
```

## 🚀 Déploiement

### Option 1 : Vercel (Recommandé)

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Configurer les variables d'environnement dans Vercel Dashboard
```

### Option 2 : Netlify

```bash
# Build de production
npm run build

# Déployer le dossier 'out' sur Netlify
```

### Option 3 : Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

## 🛠️ Développement Avancé

### Ajout de Nouvelles Fonctionnalités

1. **Nouveaux composants** : Créez dans `components/`
2. **Nouvelles routes API** : Ajoutez dans `app/api/`
3. **Styles personnalisés** : Modifiez `globals.css`
4. **Types TypeScript** : Définissez dans `lib/api.ts`

### Personnalisation du Theme

```css
/* Dans globals.css */
:root {
  --primary: 263 70% 50%;        /* Violet principal */
  --background: 224 71% 4%;      /* Arrière-plan sombre */
  --accent: 263 70% 60%;         /* Accent violet */
}
```

### Optimisations Performance

- **Lazy loading** des composants lourds
- **Memoization** des calculs coûteux
- **Compression** des images et assets
- **Code splitting** automatique Next.js

## 📊 Métriques et Analytics

### Statistiques Trackées

- **Nombre total de prédictions**
- **Confiance moyenne des prédictions**
- **Ratio positif/négatif**
- **Taux de feedback correct/incorrect**
- **Temps de réponse de l'API**

### Dashboard de Monitoring

L'interface affiche en temps réel :
- Statut de l'API (en ligne/hors ligne)
- Compteurs de prédictions
- Moyenne de confiance
- Distribution des sentiments

## 🔒 Sécurité

### Mesures Implémentées

- **Validation côté client** des entrées
- **Limitation de longueur** des tweets (500 caractères)
- **Sanitisation** des données avant envoi
- **HTTPS uniquement** pour les communications API

### Variables Sensibles

- Utilisez `.env.local` pour les secrets
- Ne commitez jamais les clés d'API
- Configurez les CORS appropriés

## 📚 Documentation API

### Endpoints Utilisés

```typescript
// Prédiction de sentiment
POST /predict
{
  "text": "Your tweet here"
}

// Feedback utilisateur  
POST /feedback
{
  "text": "Tweet text",
  "predicted_sentiment": "positive",
  "actual_sentiment": "positive", 
  "is_correct": true
}

// Santé de l'API
GET /health
```

## 🐛 Dépannage

### Problèmes Fréquents

1. **API non accessible**
   - Vérifiez l'URL dans `.env.local`
   - Testez l'API directement avec curl

2. **Erreurs de CORS**
   - Configurez les headers CORS côté API
   - Utilisez un proxy en développement

3. **Animations saccadées**
   - Réduisez le nombre de particules
   - Désactivez les animations sur mobile

### Debug

```bash
# Logs détaillés
npm run dev

# Vérifier la config
console.log(process.env.NEXT_PUBLIC_API_URL)

# Tester l'API
curl -X POST "YOUR_API_URL/predict" \
  -H "Content-Type: application/json" \
  -d '{"text": "Test tweet"}'
```

## 🤝 Contribution

Pour contribuer au projet :

1. **Fork** le repository
2. **Créez** une branche feature
3. **Développez** votre fonctionnalité
4. **Testez** soigneusement
5. **Créez** une Pull Request

### Standards de Code

- **TypeScript strict** activé
- **ESLint** pour la qualité du code
- **Prettier** pour le formatage
- **Conventions** de nommage cohérentes

---

**🎯 Projet réalisé dans le cadre du cursus Ingénieur IA - OpenClassrooms**

*Interface Next.js pour l'analyse de sentiment Air Paradis - MLOps Frontend*

## 📞 Support

Pour toute question ou problème :
- **GitHub Issues** : Rapportez les bugs
- **Documentation** : Consultez ce README
- **API Status** : Vérifiez le statut en temps réel dans l'interface
