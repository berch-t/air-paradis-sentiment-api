'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Loader2, MessageSquare, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { predictSentiment, type SentimentPrediction } from '@/lib/api'
import { cn, getSentimentEmoji, getConfidenceColor } from '@/lib/utils'

interface SentimentFormProps {
  onPrediction: (prediction: SentimentPrediction) => void
}

export default function SentimentForm({ onPrediction }: SentimentFormProps) {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!text.trim()) {
      setError('Veuillez saisir un tweet à analyser')
      return
    }

    if (text.length > 500) {
      setError('Le texte ne peut pas dépasser 500 caractères')
      return
    }

    setLoading(true)
    setError('')

    try {
      const result = await predictSentiment(text.trim())
      
      if (result.success && result.data) {
        onPrediction(result.data)
        // Ne pas vider le texte pour permettre le feedback
      } else {
        setError(result.error || 'Erreur lors de l\'analyse du sentiment')
      }
    } catch (err) {
      setError('Erreur de connexion à l\'API')
    } finally {
      setLoading(false)
    }
  }

  const exampleTweets = [
    "I absolutely love Air Paradis! Amazing crew and comfortable seats! 😊",
    "Terrible experience with Air Paradis, worst airline ever! Very disappointed.",
    "Flight was okay, nothing special but arrived on time.",
    "Outstanding customer service team, they helped me with everything!",
  ]

  const handleExampleClick = (example: string) => {
    setText(example)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="w-full max-w-2xl mx-auto relative z-10"
    >
      <Card className="glassmorphism backdrop-blur-xl border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2 text-2xl">
            <MessageSquare className="w-6 h-6 text-purple-400" />
            <span className="gradient-text">Analyseur de Sentiment</span>
            <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Textarea
                value={text}
                onChange={(e) => {
                  setText(e.target.value)
                  setError('')
                }}
                placeholder="Saisissez votre tweet ici pour analyser son sentiment... 
Exemple: 'I love this airline service!' ou 'Terrible flight experience'"
                className="min-h-[120px] text-base resize-none pr-16 glassmorphism focus:border-purple-500/50 transition-all duration-200"
                maxLength={500}
                disabled={loading}
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                {text.length}/500
              </div>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-300 text-sm"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              type="submit"
              disabled={loading || !text.trim()}
              variant="gradient"
              size="lg"
              className="w-full text-lg py-6 relative overflow-hidden group"
            >
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center space-x-2"
                  >
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Analyse en cours...</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="ready"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center space-x-2"
                  >
                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    <span>Analyser le Sentiment</span>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Animation de fond au hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
          </form>

          {/* Exemples de tweets */}
          <div className="border-t border-gray-700 pt-6">
            <h4 className="text-sm font-medium text-gray-400 mb-3">Exemples de tweets à tester :</h4>
            <div className="grid grid-cols-1 gap-2">
              {exampleTweets.map((example, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleExampleClick(example)}
                  disabled={loading}
                  className="text-left p-3 text-sm bg-gray-800/30 hover:bg-gray-700/30 border border-gray-700/50 hover:border-purple-500/30 rounded-lg transition-all duration-200 disabled:opacity-50"
                >
                  <span className="text-gray-300">{example}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
