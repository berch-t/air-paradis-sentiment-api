'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, Wifi, WifiOff, Activity, Github } from 'lucide-react'
import BackgroundParticles from '../components/BackgroundParticles'
import AnimatedHeader from '../components/AnimatedHeader'
import SentimentForm from '../components/SentimentForm'
import SentimentResult from '../components/SentimentResult'
import { Button } from '../components/ui/button'
import { type SentimentPrediction, checkApiHealth } from '../lib/api'
import logger from '../lib/logger'
import { useEffect } from 'react'

export default function HomePage() {
  const [prediction, setPrediction] = useState<SentimentPrediction | null>(null)
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking')
  const [stats, setStats] = useState({
    totalPredictions: 0,
    averageConfidence: 0,
    positiveCount: 0,
    negativeCount: 0
  })

  // Vérification du statut de l'API au démarrage
  useEffect(() => {
    // Log du démarrage de l'application
    logger.logAppStart()
    
    const checkStatus = async () => {
      try {
        const result = await checkApiHealth()
        const newStatus = result.success ? 'online' : 'offline'
        
        if (newStatus !== apiStatus) {
          logger.info(`Statut API changé: ${newStatus}`, {
            context: {
              previousStatus: apiStatus,
              newStatus,
              apiResponse: result
            }
          })
        }
        
        setApiStatus(newStatus)
      } catch (error) {
        logger.logApiError('health-check', error as Error)
        setApiStatus('offline')
      }
    }
    
    checkStatus()
    
    // Vérifier toutes les 30 secondes
    const interval = setInterval(checkStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleNewPrediction = (newPrediction: SentimentPrediction) => {
    setPrediction(newPrediction)
    
    // Log de la nouvelle prédiction
    logger.info('Nouvelle prédiction générée', {
      text: newPrediction.text,
      predicted_sentiment: newPrediction.sentiment,
      confidence: newPrediction.confidence,
      request_id: newPrediction.request_id
    })
    
    // Mettre à jour les statistiques
    setStats(prev => {
      const newStats = {
        totalPredictions: prev.totalPredictions + 1,
        averageConfidence: (prev.averageConfidence * prev.totalPredictions + newPrediction.confidence) / (prev.totalPredictions + 1),
        positiveCount: prev.positiveCount + (newPrediction.sentiment === 'positive' ? 1 : 0),
        negativeCount: prev.negativeCount + (newPrediction.sentiment === 'negative' ? 1 : 0)
      }
      
      // Log des statistiques mises à jour
      logger.debug('Statistiques mises à jour', {
        context: {
          previousStats: prev,
          newStats
        }
      })
      
      return newStats
    })
  }

  const handleReset = () => {
    logger.logUserAction('reset-analysis')
    setPrediction(null)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Particules d'arrière-plan */}
      <BackgroundParticles />
      
      {/* Contenu principal */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Statut de l'API */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 right-4 z-50"
        >
          <div className={`flex items-center space-x-2 px-3 py-2 rounded-full text-xs font-medium glassmorphism backdrop-blur-md ${
            apiStatus === 'online' 
              ? 'text-green-400 border-green-500/30' 
              : apiStatus === 'offline'
              ? 'text-red-400 border-red-500/30'
              : 'text-yellow-400 border-yellow-500/30'
          }`}>
            {apiStatus === 'checking' && <Activity className="w-3 h-3 animate-pulse" />}
            {apiStatus === 'online' && <Wifi className="w-3 h-3" />}
            {apiStatus === 'offline' && <WifiOff className="w-3 h-3" />}
            <span>
              API {apiStatus === 'online' ? 'En ligne' : apiStatus === 'offline' ? 'Hors ligne' : 'Vérification...'}
            </span>
          </div>
        </motion.div>

        {/* Statistiques en temps réel */}
        {stats.totalPredictions > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="fixed top-4 left-4 z-50"
          >
            <div className="glassmorphism backdrop-blur-md rounded-lg p-3 text-xs space-y-1">
              <div className="text-gray-400 font-medium">Statistiques</div>
              <div className="text-white">Prédictions: {stats.totalPredictions}</div>
              <div className="text-white">Confiance moy.: {(stats.averageConfidence * 100).toFixed(1)}%</div>
              <div className="flex space-x-2 text-xs">
                <span className="text-green-400">😊 {stats.positiveCount}</span>
                <span className="text-red-400">😔 {stats.negativeCount}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* En-tête animé */}
        <AnimatedHeader />

        {/* Formulaire d'analyse */}
        <div className="space-y-8">
          <SentimentForm onPrediction={handleNewPrediction} />

          {/* Résultats */}
          <AnimatePresence mode="wait">
            {prediction && (
              <motion.div
                key={prediction.request_id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <SentimentResult prediction={prediction} />
                
                {/* Bouton pour nouvelle analyse */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex justify-center"
                >
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    size="lg"
                    className="group hover:bg-purple-500/20 hover:border-purple-500/50 transition-all duration-300"
                  >
                    <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                    Nouvelle Analyse
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-16 py-8 text-center border-t border-gray-800"
        >
          <div className="space-y-2">
            <p className="text-gray-400 text-sm">
              Propulsé par un modèle IA avancée BiLSTM + Word2Vec
            </p>
            <p className="text-gray-500 text-xs">
              Modèle déployé sur Google Cloud Run • Précision: 80% • MLOps Pipeline 
            </p>
            <div className="flex justify-center space-x-4 text-xs text-gray-600 mt-4">
              <span>TensorFlow 2.16</span>
              <span>•</span>
              <span>FastAPI</span>
              <span>•</span>
              <span>Next.js</span>
              <span>•</span>
              <span>MLflow</span>
            </div>
          </div>
          
          {/* GitHub + Copyright */}
          <div className="mt-6 pt-4 border-t border-gray-900 space-y-4">
            {/* Lien GitHub */}
            <div className="flex justify-center">
              <a
                href="https://github.com/berch-t/air-paradis-sentiment-api"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 rounded-full glassmorphism backdrop-blur-md text-gray-300 hover:text-white transition-all duration-300 group hover:bg-gray-800/30"
              >
                <Github className="w-4 h-4" />
                <span className="text-sm font-mono">&lt;&gt; code</span>
              </a>
            </div>
            
            {/* Copyright */}
            <div className="text-xs text-gray-500 space-y-1">
              <p>
                © 2025 Thomas Berchet. Licensed under the{' '}
                <a 
                  href="https://opensource.org/licenses/MIT" 
                  className="text-blue-400 hover:text-blue-300 underline" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  MIT License
                </a>
                .
              </p>
              <p>
                <a 
                  href="mailto:berchet.thomas@gmail.com" 
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  Contacter l'auteur
                </a>
              </p>
            </div>
          </div>
        </motion.footer>
      </div>

      {/* Gradient overlay pour l'effet de profondeur */}
      <div className="fixed inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20 pointer-events-none z-5" />
    </div>
  )
}
