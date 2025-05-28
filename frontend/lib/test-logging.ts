/**
 * Script de test pour le système de logging Air Paradis
 * Teste les différents niveaux de logs et les intégrations
 */

import logger from '../lib/logger'

// Fonction pour tester tous les niveaux de logging
function testLoggingLevels() {
  console.log('🧪 Test des niveaux de logging...')

  // Test DEBUG
  logger.debug('Test de log debug', {
    context: {
      test: 'debug_level',
      timestamp: new Date().toISOString()
    }
  })

  // Test INFO
  logger.info('Test de log info', {
    context: {
      test: 'info_level',
      user_action: 'test_logging'
    }
  })

  // Test WARNING
  logger.warning('Test de log warning', {
    event_type: 'test_warning',
    context: {
      test: 'warning_level'
    }
  })

  // Test ERROR
  logger.error('Test de log error', {
    error: 'Test error message',
    context: {
      test: 'error_level',
      component: 'test_script'
    }
  })

  // Test CRITICAL
  logger.critical('Test de log critical', {
    error: 'Test critical error',
    context: {
      test: 'critical_level',
      severity: 'high'
    }
  })
}

// Fonction pour tester les logs spécialisés
function testSpecializedLogs() {
  console.log('🎯 Test des logs spécialisés...')

  // Test prédiction correcte
  logger.logCorrectPrediction(
    'I love this airline!',
    'positive',
    0.87,
    'test_req_001',
    'test_user'
  )

  // Test prédiction incorrecte (devrait déclencher une alerte)
  logger.logIncorrectPrediction(
    'This airline is terrible!',
    'positive', // prédiction incorrecte
    'negative', // sentiment réel
    0.65,
    'test_req_002',
    'test_user'
  )

  // Test métriques de performance
  logger.logPerformanceMetrics({
    responseTime: 1250,
    modelLoadTime: 500,
    predictionTime: 750
  })

  // Test erreur API
  const testError = new Error('Test API error')
  testError.stack = 'Test stack trace...'
  logger.logApiError('/predict', testError, {
    endpoint: '/predict',
    method: 'POST',
    statusCode: 500
  })

  // Test erreur UI
  const testUIError = new Error('Test UI component error')
  logger.logUIError('TestComponent', testUIError, {
    component: 'TestComponent',
    props: { test: true },
    state: { loading: false }
  })

  // Test action utilisateur
  logger.logUserAction('test-action', {
    button_clicked: 'test_button',
    timestamp: Date.now()
  })
}

// Test de déclenchement d'alerte (3 erreurs en 5 minutes)
function testAlertTrigger() {
  console.log("🚨 Test de déclenchement d'alerte...")

  // Simuler 3 prédictions incorrectes rapidement
  for (let i = 1; i <= 3; i++) {
    setTimeout(() => {
      logger.logIncorrectPrediction(
        `Test incorrect prediction ${i}`,
        'positive',
        'negative',
        0.6 + i * 0.1,
        `test_alert_${i}`,
        'test_user'
      )

      if (i === 3) {
        console.log('✅ 3 prédictions incorrectes envoyées - alerte devrait être déclenchée')
      }
    }, i * 1000) // Espacer de 1 seconde
  }
}

// Test de stress (beaucoup de logs rapidement)
function testStressLogging() {
  console.log('💪 Test de stress du système de logging...')

  const promises = []

  for (let i = 0; i < 20; i++) {
    const promise = new Promise(resolve => {
      setTimeout(() => {
        logger.info(`Log de stress ${i}`, {
          stress_test: true,
          iteration: i,
          timestamp: Date.now()
        })
        resolve(i)
      }, Math.random() * 100) // Délai aléatoire entre 0-100ms
    })

    promises.push(promise)
  }

  Promise.all(promises).then(() => {
    console.log('✅ Test de stress terminé')
  })
}

// Test de la récupération des statistiques
async function testStatsRetrieval() {
  console.log('📊 Test de récupération des statistiques...')

  try {
    const response = await fetch('/api/logging', {
      method: 'GET'
    })

    if (response.ok) {
      const stats = await response.json()
      console.log('📈 Statistiques récupérées:', stats)
    } else {
      console.error('❌ Erreur lors de la récupération des statistiques:', response.status)
    }
  } catch (error) {
    console.error('❌ Erreur de connexion pour les statistiques:', error)
  }
}

// Fonction principale de test
export async function runLoggingTests() {
  console.log('🚀 Démarrage des tests de logging Air Paradis...')
  console.log('='.repeat(50))

  testLoggingLevels()
  await new Promise(resolve => setTimeout(resolve, 2000))

  testSpecializedLogs()
  await new Promise(resolve => setTimeout(resolve, 2000))

  testAlertTrigger()
  await new Promise(resolve => setTimeout(resolve, 6000))

  testStressLogging()
  await new Promise(resolve => setTimeout(resolve, 3000))

  await testStatsRetrieval()

  console.log('='.repeat(50))
  console.log('✅ Tests de logging terminés!')
  console.log('🔍 Vérifiez les logs dans la console et les alertes déclenchées')
}

// Exporter pour utilisation dans le navigateur
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.testLogging = runLoggingTests
  console.log('💡 Pour lancer les tests, tapez: window.testLogging()')
}

export default { runLoggingTests }
