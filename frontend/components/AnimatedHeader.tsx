'use client'

import { motion } from 'framer-motion'
import { Sparkles, Zap, Bot } from 'lucide-react'

export default function AnimatedHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="text-center mb-12 relative z-10"
    >
      {/* Logo animé */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="flex justify-center mb-8"
      >
        <div className="relative">
          <motion.img
            src="/logo.png"
            alt="Air Paradis Sentiment AI"
            width={130}
            height={130}
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 2, -2, 0]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="drop-shadow-2xl"
          />
          {/* Effet de lueur autour du logo */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl -z-10 animate-pulse" />
        </div>
      </motion.div>

      {/* Titre principal */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-glow"
      >
        Air Paradis
      </motion.h1>

      {/* Sous-titre */}
      <motion.h2
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="text-2xl md:text-3xl font-semibold mb-2 text-purple-300"
      >
        Sentiment Analysis
      </motion.h2>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="text-lg text-gray-400 max-w-2xl mx-auto mb-8"
      >
        Analysez le sentiment de vos tweets en temps réel avec notre IA avancée basée sur un modèle BiLSTM et Word2Vec
      </motion.p>

      {/* Indicateurs de performance */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="flex justify-center space-x-8 text-sm text-gray-500"
      >
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span>80% Accuracy</span>
        </div>
        <div className="flex items-center space-x-2">
          <Bot className="w-4 h-4 text-purple-400" />
          <span>BiLSTM + Word2Vec</span>
        </div>
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-pink-400" />
          <span>Temps réel</span>
        </div>
      </motion.div>
    </motion.div>
  )
}
