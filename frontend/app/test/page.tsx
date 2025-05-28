'use client'

import LoggingTestPanel from '@/components/LoggingTestPanel'
import BackgroundParticles from '@/components/BackgroundParticles'
import { motion } from 'framer-motion'
import { ArrowLeft, TestTube } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function TestPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Particules d'arrière-plan */}
      <BackgroundParticles />
      
      {/* Contenu principal */}
      <div className="relative z-10 min-h-screen py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-4 mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Retour</span>
                </Button>
              </Link>
              
              <div className="flex items-center space-x-2">
                <TestTube className="w-6 h-6 text-purple-400" />
                <h1 className="text-2xl font-bold gradient-text">
                  Tests du Système de Logging
                </h1>
              </div>
            </div>
            
            <div className="hidden md:block text-sm text-gray-400">
              Mode Développement
            </div>
          </div>
        </motion.div>
        
        {/* Panel de test */}
        <LoggingTestPanel />
        
        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="container mx-auto px-4 py-8 text-center"
        >
          <div className="space-y-2">
            <p className="text-gray-400 text-sm">
              🔧 Outils de développement pour le système de logging Air Paradis
            </p>
            <p className="text-gray-500 text-xs">
              Utilisez ces outils pour tester les alertes, le monitoring et les intégrations Google Cloud
            </p>
          </div>
        </motion.footer>
      </div>
      
      {/* Gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20 pointer-events-none z-5" />
    </div>
  )
}
