'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Bug, 
  AlertTriangle, 
  Info, 
  AlertCircle, 
  Zap,
  Activity,
  BarChart3,
  TestTube
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import logger from '@/lib/logger'
import { runLoggingTests } from '@/lib/test-logging'

interface LogStats {
  recentErrorCount: number
  alertThreshold: number
  timeWindowMinutes: number
  projectId: string
  recentErrors: Array<{
    timestamp: string
    level: string
    message: string
    eventType?: string
  }>
  systemStatus: {
    googleCloudLoggingEnabled: boolean
    alertWebhookEnabled: boolean
    environment: string
  }
}

export default function LoggingTestPanel() {
  const [stats, setStats] = useState<LogStats | null>(null)
  const [customMessage, setCustomMessage] = useState('')
  const [loading, setLoading] = useState<string | null>(null)
  const [lastAction, setLastAction] = useState<string | null>(null)

  const fetchStats = async () => {
    setLoading('stats')
    try {
      const response = await fetch('/api/logging')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
        setLastAction('Statistiques récupérées')
      } else {
        throw new Error(`HTTP ${response.status}`)
      }
    } catch (error) {
      logger.logUIError('LoggingTestPanel', error as Error, {
        action: 'fetch_stats'
      })
      setLastAction('Erreur lors de la récupération')
    } finally {
      setLoading(null)
    }
  }

  const testLog = (level: string, shouldTriggerAlert = false) => {
    setLoading(level)
    
    const message = customMessage || `Test de log ${level}`
    const timestamp = new Date().toISOString()
    
    switch (level) {
      case 'debug':
        logger.debug(message, {
          context: { test: true, timestamp }
        })
        break
      case 'info':
        logger.info(message, {
          context: { test: true, timestamp }
        })
        break
      case 'warning':
        logger.warning(message, {
          event_type: shouldTriggerAlert ? 'test_alert' : 'test_warning',
          context: { test: true, timestamp }
        })
        break
      case 'error':
        logger.error(message, {
          error: 'Test error message',
          context: { test: true, timestamp }
        })
        break
      case 'critical':
        logger.critical(message, {
          error: 'Test critical error',
          context: { test: true, timestamp, severity: 'high' }
        })
        break
    }
    
    setLastAction(`Log ${level.toUpperCase()} envoyé`)
    setTimeout(() => setLoading(null), 1000)
  }

  const testIncorrectPrediction = () => {
    setLoading('incorrect')
    logger.logIncorrectPrediction(
      'Test prediction text',
      'positive',
      'negative',
      0.75,
      `test_${Date.now()}`,
      'test_user'
    )
    setLastAction('⚠️ Prédiction incorrecte loggée (peut déclencher une alerte)')
    setTimeout(() => setLoading(null), 1000)
  }

  const testCorrectPrediction = () => {
    setLoading('correct')
    logger.logCorrectPrediction(
      'Test prediction text',
      'positive',
      0.88,
      `test_${Date.now()}`,
      'test_user'
    )
    setLastAction('✅ Prédiction correcte loggée')
    setTimeout(() => setLoading(null), 1000)
  }

  const testPerformanceMetrics = () => {
    setLoading('performance')
    logger.logPerformanceMetrics({
      responseTime: Math.random() * 2000 + 500,
      modelLoadTime: Math.random() * 1000 + 200,
      predictionTime: Math.random() * 800 + 100
    })
    setLastAction('📊 Métriques de performance loggées')
    setTimeout(() => setLoading(null), 1000)
  }

  const triggerAlertTest = () => {
    setLoading('alert')
    // Envoyer 3 prédictions incorrectes rapidement
    for (let i = 1; i <= 3; i++) {
      setTimeout(() => {
        logger.logIncorrectPrediction(
          `Alert test prediction ${i}`,
          'positive',
          'negative',
          0.6,
          `alert_test_${i}_${Date.now()}`,
          'test_user'
        )
        
        if (i === 3) {
          setLastAction('🚨 Test d\'alerte terminé (3 prédictions incorrectes envoyées)')
          setLoading(null)
        }
      }, i * 500) // Espacer de 500ms
    }
  }

  const runFullTest = async () => {
    setLoading('fulltest')
    setLastAction('🧪 Lancement des tests complets...')
    
    try {
      await runLoggingTests()
      setLastAction('✅ Tests complets terminés - vérifiez la console')
    } catch (error) {
      setLastAction('❌ Erreur lors des tests complets')
      logger.logUIError('LoggingTestPanel', error as Error, {
        action: 'full_test'
      })
    } finally {
      setLoading(null)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto p-6 space-y-6"
    >
      <Card className="glassmorphism backdrop-blur-xl border-purple-500/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TestTube className="w-5 h-5 text-purple-400" />
            <span className="gradient-text">Panel de Test - Système de Logging</span>
            <Badge variant="secondary">Dev Tools</Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Message personnalisé */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Message personnalisé (optionnel)
            </label>
            <Textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Saisissez un message personnalisé pour les tests de log..."
              className="min-h-[80px] glassmorphism"
            />
          </div>

          {/* Status de la dernière action */}
          {lastAction && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3"
            >
              <p className="text-blue-300 text-sm font-medium">
                📝 {lastAction}
              </p>
            </motion.div>
          )}

          {/* Tests des niveaux de log */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <Bug className="w-5 h-5" />
              <span>Tests des Niveaux de Log</span>
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <Button
                onClick={() => testLog('debug')}
                disabled={loading !== null}
                variant="outline"
                size="sm"
                className="flex items-center space-x-1 hover:bg-gray-700/50"
              >
                {loading === 'debug' ? (
                  <div className="spinner w-3 h-3" />
                ) : (
                  <Info className="w-3 h-3" />
                )}
                <span>DEBUG</span>
              </Button>
              
              <Button
                onClick={() => testLog('info')}
                disabled={loading !== null}
                variant="outline"
                size="sm"
                className="flex items-center space-x-1 hover:bg-blue-700/50"
              >
                {loading === 'info' ? (
                  <div className="spinner w-3 h-3" />
                ) : (
                  <Info className="w-3 h-3" />
                )}
                <span>INFO</span>
              </Button>
              
              <Button
                onClick={() => testLog('warning')}
                disabled={loading !== null}
                variant="outline"
                size="sm"
                className="flex items-center space-x-1 hover:bg-yellow-700/50"
              >
                {loading === 'warning' ? (
                  <div className="spinner w-3 h-3" />
                ) : (
                  <AlertTriangle className="w-3 h-3" />
                )}
                <span>WARNING</span>
              </Button>
              
              <Button
                onClick={() => testLog('error')}
                disabled={loading !== null}
                variant="outline"
                size="sm"
                className="flex items-center space-x-1 hover:bg-red-700/50"
              >
                {loading === 'error' ? (
                  <div className="spinner w-3 h-3" />
                ) : (
                  <AlertCircle className="w-3 h-3" />
                )}
                <span>ERROR</span>
              </Button>
              
              <Button
                onClick={() => testLog('critical')}
                disabled={loading !== null}
                variant="outline"
                size="sm"
                className="flex items-center space-x-1 hover:bg-red-900/50"
              >
                {loading === 'critical' ? (
                  <div className="spinner w-3 h-3" />
                ) : (
                  <Zap className="w-3 h-3" />
                )}
                <span>CRITICAL</span>
              </Button>
            </div>
          </div>

          {/* Tests spécialisés */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Tests Spécialisés</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button
                onClick={testCorrectPrediction}
                disabled={loading !== null}
                variant="success"
                className="flex items-center space-x-2"
              >
                {loading === 'correct' ? (
                  <div className="spinner w-4 h-4" />
                ) : (
                  <span>✅</span>
                )}
                <span>Prédiction Correcte</span>
              </Button>
              
              <Button
                onClick={testIncorrectPrediction}
                disabled={loading !== null}
                variant="warning"
                className="flex items-center space-x-2"
              >
                {loading === 'incorrect' ? (
                  <div className="spinner w-4 h-4" />
                ) : (
                  <span>⚠️</span>
                )}
                <span>Prédiction Incorrecte</span>
              </Button>
              
              <Button
                onClick={testPerformanceMetrics}
                disabled={loading !== null}
                variant="outline"
                className="flex items-center space-x-2"
              >
                {loading === 'performance' ? (
                  <div className="spinner w-4 h-4" />
                ) : (
                  <BarChart3 className="w-4 h-4" />
                )}
                <span>Métriques Performance</span>
              </Button>
              
              <Button
                onClick={triggerAlertTest}
                disabled={loading !== null}
                variant="destructive"
                className="flex items-center space-x-2"
              >
                {loading === 'alert' ? (
                  <div className="spinner w-4 h-4" />
                ) : (
                  <span>🚨</span>
                )}
                <span>Déclencher Alerte</span>
              </Button>
            </div>
          </div>

          {/* Tests complets */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <TestTube className="w-5 h-5" />
              <span>Tests Complets</span>
            </h3>
            
            <div className="flex space-x-3">
              <Button
                onClick={runFullTest}
                disabled={loading !== null}
                variant="gradient"
                size="lg"
                className="flex-1"
              >
                {loading === 'fulltest' ? (
                  <div className="flex items-center space-x-2">
                    <div className="spinner w-4 h-4" />
                    <span>Tests en cours...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <TestTube className="w-4 h-4" />
                    <span>Lancer Tous les Tests</span>
                  </div>
                )}
              </Button>
              
              <Button
                onClick={fetchStats}
                disabled={loading !== null}
                variant="outline"
                size="lg"
              >
                {loading === 'stats' ? (
                  <div className="spinner w-4 h-4" />
                ) : (
                  <BarChart3 className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">Stats</span>
              </Button>
            </div>
          </div>

          {/* Statistiques */}
          {stats && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Statistiques du Système</span>
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-red-400">
                    {stats.recentErrorCount}
                  </div>
                  <div className="text-xs text-gray-400">
                    Erreurs récentes
                  </div>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {stats.alertThreshold}
                  </div>
                  <div className="text-xs text-gray-400">
                    Seuil d'alerte
                  </div>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {stats.timeWindowMinutes}m
                  </div>
                  <div className="text-xs text-gray-400">
                    Fenêtre de temps
                  </div>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {stats.systemStatus.environment}
                  </div>
                  <div className="text-xs text-gray-400">
                    Environnement
                  </div>
                </div>
              </div>
              
              {stats.recentErrors.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <h4 className="text-red-400 font-medium mb-2">
                    Erreurs Récentes ({stats.recentErrors.length})
                  </h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {stats.recentErrors.map((error, index) => (
                      <div key={index} className="text-xs bg-red-500/5 rounded p-2">
                        <div className="flex justify-between items-start">
                          <span className="text-red-300">{error.message}</span>
                          <Badge variant="destructive" className="text-xs">
                            {error.level}
                          </Badge>
                        </div>
                        <div className="text-gray-500 mt-1">
                          {new Date(error.timestamp).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Instructions */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <h4 className="text-blue-400 font-medium mb-2 flex items-center space-x-2">
              <Info className="w-4 h-4" />
              <span>Instructions</span>
            </h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Ouvrez la console du navigateur pour voir tous les logs</li>
              <li>• Les prédictions incorrectes déclenchent des alertes après 3 occurrences</li>
              <li>• Les tests complets incluent des tests de stress et de performance</li>
              <li>• Vérifiez les logs backend dans Google Cloud Logging</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
