'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, TrendingUp, Clock, Brain, Zap, ThumbsUp, ThumbsDown, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { type SentimentPrediction, submitFeedback } from '@/lib/api'
import { cn, formatTimestamp, getConfidenceColor, getSentimentEmoji } from '@/lib/utils'
import logger from '@/lib/logger'

interface SentimentResultProps {
  prediction: SentimentPrediction
}

export default function SentimentResult({ prediction }: SentimentResultProps) {
  const [feedbackGiven, setFeedbackGiven] = useState(false)
  const [feedbackLoading, setFeedbackLoading] = useState<'correct' | 'incorrect' | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleFeedback = async (isCorrect: boolean) => {
    const feedbackType = isCorrect ? 'correct' : 'incorrect'
    setFeedbackLoading(feedbackType)
    
    try {
      // Soumettre le feedback à l'API
      const actualSentiment = isCorrect ? prediction.sentiment : (prediction.sentiment === 'positive' ? 'negative' : 'positive')
      const feedbackData = {
        text: prediction.text,
        predicted_sentiment: prediction.sentiment,
        actual_sentiment: actualSentiment,
        is_correct: isCorrect,
        user_id: 'frontend_user'
      }

      // Log de l'action utilisateur
      logger.logUserAction(`feedback-${feedbackType}`, {
        text: prediction.text,
        predicted_sentiment: prediction.sentiment,
        actual_sentiment: actualSentiment,
        confidence: prediction.confidence,
        request_id: prediction.request_id
      })

      const result = await submitFeedback(feedbackData)
      
      if (result.success) {
        // Log vers Google Cloud pour monitoring
        if (isCorrect) {
          logger.logCorrectPrediction(
            prediction.text, 
            prediction.sentiment, 
            prediction.confidence,
            prediction.request_id,
            'frontend_user'
          )
          setShowSuccess(true)
          setTimeout(() => setShowSuccess(false), 3000)
        } else {
          // ALERTE : Prédiction incorrecte - déclenche le monitoring
          logger.logIncorrectPrediction(
            prediction.text, 
            prediction.sentiment, 
            actualSentiment, 
            prediction.confidence,
            prediction.request_id,
            'frontend_user'
          )
        }
        
        setFeedbackGiven(true)
        
        logger.info('Feedback soumis avec succès', {
          event_type: 'feedback_submitted',
          is_correct: isCorrect,
          predicted_sentiment: prediction.sentiment,
          actual_sentiment: actualSentiment,
          confidence: prediction.confidence,
          request_id: prediction.request_id
        })
      } else {
        throw new Error('Erreur lors de la soumission du feedback')
      }
    } catch (error) {
      logger.logUIError('SentimentResult', error as Error, {
        action: 'feedback_submission',
        feedbackType,
        prediction: {
          text: prediction.text,
          sentiment: prediction.sentiment,
          confidence: prediction.confidence,
          request_id: prediction.request_id
        }
      })
      
      console.error('Erreur lors de l\'envoi du feedback:', error)
    } finally {
      setFeedbackLoading(null)
    }
  }

  const isPositive = prediction.sentiment === 'positive'
  const confidenceColor = getConfidenceColor(prediction.confidence)
  const sentimentEmoji = getSentimentEmoji(prediction.sentiment)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-2xl mx-auto relative z-10"
    >
      <Card className="glassmorphism backdrop-blur-xl border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
        <CardHeader className="text-center pb-4">
          <CardTitle className="flex items-center justify-center space-x-2 text-xl">
            <Brain className="w-5 h-5 text-purple-400" />
            <span className="gradient-text">Résultat de l'Analyse</span>
            <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Tweet analysé */}
          <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
            <p className="text-gray-300 text-sm mb-2 font-medium">Tweet analysé :</p>
            <p className="text-white text-base leading-relaxed">"{prediction.text}"</p>
          </div>

          {/* Résultat principal */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={cn(
              "relative overflow-hidden rounded-xl p-6 text-center",
              isPositive 
                ? "bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30" 
                : "bg-gradient-to-br from-red-500/20 to-rose-500/20 border border-red-500/30"
            )}
          >
            <div className="flex items-center justify-center space-x-3 mb-4">
              <motion.div
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center",
                  isPositive ? "bg-green-500" : "bg-red-500"
                )}
              >
                {isPositive ? (
                  <CheckCircle className="w-6 h-6 text-white" />
                ) : (
                  <XCircle className="w-6 h-6 text-white" />
                )}
              </motion.div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">
                  Sentiment {isPositive ? 'Positif' : 'Négatif'} {sentimentEmoji}
                </h3>
                <p className={cn("text-lg font-semibold", confidenceColor)}>
                  Confiance : {(prediction.confidence * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Barre de confiance */}
            <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${prediction.confidence * 100}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className={cn(
                  "h-2 rounded-full",
                  isPositive ? "bg-green-500" : "bg-red-500"
                )}
              />
            </div>

            {/* Métriques détaillées */}
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="bg-gray-800/50 rounded-lg p-3">
                <TrendingUp className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                <p className="text-gray-400">Probabilité</p>
                <p className="text-white font-semibold">{(prediction.probability * 100).toFixed(1)}%</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <Brain className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                <p className="text-gray-400">Modèle</p>
                <p className="text-white font-semibold text-xs">{prediction.model}</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <Clock className="w-4 h-4 text-green-400 mx-auto mb-1" />
                <p className="text-gray-400">Temps</p>
                <p className="text-white font-semibold text-xs">Temps réel</p>
              </div>
            </div>
          </motion.div>

          {/* Section de feedback */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="border-t border-gray-700 pt-6"
          >
            <h4 className="text-center text-gray-400 mb-4 font-medium">
              Cette prédiction est-elle correcte ?
            </h4>
            
            <AnimatePresence mode="wait">
              {!feedbackGiven ? (
                <motion.div
                  key="feedback-buttons"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex space-x-4 justify-center"
                >
                  <Button
                    onClick={() => handleFeedback(true)}
                    disabled={feedbackLoading !== null}
                    variant="success"
                    size="lg"
                    className="flex-1 max-w-xs relative overflow-hidden group"
                  >
                    {feedbackLoading === 'correct' ? (
                      <div className="flex items-center space-x-2">
                        <div className="spinner" />
                        <span>Envoi...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <ThumbsUp className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span>Oui, c'est correct</span>
                      </div>
                    )}
                  </Button>
                  
                  <Button
                    onClick={() => handleFeedback(false)}
                    disabled={feedbackLoading !== null}
                    variant="warning"
                    size="lg"
                    className="flex-1 max-w-xs relative overflow-hidden group"
                  >
                    {feedbackLoading === 'incorrect' ? (
                      <div className="flex items-center space-x-2">
                        <div className="spinner" />
                        <span>Envoi...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <ThumbsDown className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span>Non, c'est incorrect</span>
                      </div>
                    )}
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="feedback-thanks"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center"
                >
                  <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                    <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
                    <p className="text-green-300 font-medium">Merci pour votre feedback !</p>
                    <p className="text-gray-400 text-sm mt-1">
                      Votre retour nous aide à améliorer notre modèle d'IA
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Animation de succès */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
              >
                <div className="bg-green-500/90 backdrop-blur-sm rounded-full p-8">
                  <svg className="checkmark" viewBox="0 0 52 52">
                    <circle className="checkmark__circle" fill="none" stroke="#10b981" strokeWidth="2" cx="26" cy="26" r="25"/>
                    <path className="checkmark__check" fill="none" stroke="#10b981" strokeWidth="2" d="m14.1 27.2l7.1 7.2 16.7-16.8"/>
                  </svg>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Informations techniques */}
          <div className="text-xs text-gray-500 text-center border-t border-gray-700 pt-4">
            <p>ID de requête: {prediction.request_id}</p>
            <p>Tokenizer: {prediction.tokenizer_type} • Timestamp: {formatTimestamp(prediction.timestamp)}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
