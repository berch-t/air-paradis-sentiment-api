import { NextRequest, NextResponse } from 'next/server'

// Configuration pour Google Cloud Logging
const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT || 'air-paradis-sentiment'
const ALERT_THRESHOLD = 3
const ALERT_TIME_WINDOW_MS = 5 * 60 * 1000 // 5 minutes

// Store temporaire des erreurs (en production, utiliser Redis ou base de données)
interface ErrorEntry {
  timestamp: number
  level: string
  message: string
  data: any
}

let recentErrors: ErrorEntry[] = []

// Fonction pour nettoyer les anciennes erreurs
function cleanOldErrors() {
  const now = Date.now()
  recentErrors = recentErrors.filter(error => 
    now - error.timestamp < ALERT_TIME_WINDOW_MS
  )
}

// Fonction pour envoyer une alerte (ici simulée, peut être remplacée par email/SMS)
async function sendAlert(errorCount: number, recentErrorsData: ErrorEntry[]) {
  const alertMessage = `🚨 ALERTE Air Paradis Sentiment API: ${errorCount} erreurs détectées en 5 minutes`
  
  console.error(alertMessage, {
    errorCount,
    timeWindow: '5 minutes',
    errors: recentErrorsData.slice(-3), // Les 3 dernières erreurs
    timestamp: new Date().toISOString(),
    project: PROJECT_ID
  })

  // En production, vous pourriez envoyer un email ou SMS via:
  // - SendGrid API
  // - Twilio API
  // - Google Cloud Pub/Sub
  // - Webhook vers Slack/Discord
  
  try {
    // Exemple d'envoi vers un webhook (Slack, Discord, etc.)
    if (process.env.ALERT_WEBHOOK_URL) {
      await fetch(process.env.ALERT_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: alertMessage,
          attachments: [{
            color: 'danger',
            fields: [{
              title: 'Détails',
              value: `${errorCount} erreurs en 5 minutes`,
              short: true
            }, {
              title: 'Projet',
              value: PROJECT_ID,
              short: true
            }]
          }]
        })
      })
    }
  } catch (webhookError) {
    console.error('Erreur envoi webhook:', webhookError)
  }
}

// Fonction pour envoyer vers Google Cloud Logging
async function sendToGoogleCloudLogging(logEntry: any) {
  try {
    // Méthode 1: Via l'API REST Google Cloud Logging
    if (process.env.GOOGLE_CLOUD_LOGGING_API_KEY) {
      const loggingUrl = `https://logging.googleapis.com/v2/entries:write?key=${process.env.GOOGLE_CLOUD_LOGGING_API_KEY}`
      
      const cloudLogEntry = {
        entries: [{
          logName: `projects/${PROJECT_ID}/logs/${logEntry.logName || 'air-paradis-frontend'}`,
          resource: {
            type: 'global'
          },
          severity: mapLevelToSeverity(logEntry.level),
          timestamp: new Date(logEntry.timestamp).toISOString(),
          jsonPayload: {
            message: logEntry.message,
            data: logEntry.data,
            source: logEntry.source,
            userAgent: logEntry.userAgent,
            ip: logEntry.ip,
            metadata: {
              version: '1.0.0',
              environment: process.env.NODE_ENV || 'development'
            }
          }
        }]
      }

      const response = await fetch(loggingUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GOOGLE_CLOUD_ACCESS_TOKEN}`
        },
        body: JSON.stringify(cloudLogEntry)
      })

      if (!response.ok) {
        throw new Error(`Google Cloud Logging API error: ${response.status}`)
      }
    }
    
    // Méthode 2: Via un endpoint de votre API FastAPI backend
    // Cette méthode permet de centraliser la logique de logging côté backend
    if (process.env.NEXT_PUBLIC_API_URL) {
      const backendLogUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/logging`
      
      await fetch(backendLogUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logEntry)
      })
    }

  } catch (error) {
    console.error('Erreur envoi vers Google Cloud Logging:', error)
    // Ne pas faire échouer la requête si le logging externe échoue
  }
}

// Mapper les niveaux de log vers les sévérités Google Cloud
function mapLevelToSeverity(level: string): string {
  const mapping: { [key: string]: string } = {
    'DEBUG': 'DEBUG',
    'INFO': 'INFO',
    'WARNING': 'WARNING',
    'ERROR': 'ERROR',
    'CRITICAL': 'CRITICAL'
  }
  return mapping[level.toUpperCase()] || 'INFO'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { level, message, data, timestamp, projectId, logName } = body

    // Validation des données d'entrée
    if (!level || !message) {
      return NextResponse.json(
        { success: false, error: 'Niveau et message requis' },
        { status: 400 }
      )
    }
    
    const logEntry = {
      timestamp: timestamp || Date.now(),
      level: level.toUpperCase(),
      message,
      data: data || {},
      projectId: projectId || PROJECT_ID,
      logName: logName || 'air-paradis-frontend',
      source: 'air-paradis-frontend',
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || 
          request.headers.get('x-real-ip') || 
          'unknown',
    }

    // Log local pour debug
    const logLevel = level.toLowerCase()
    const logMessage = `[${logEntry.source}] ${message}`
    
    switch (logLevel) {
      case 'debug':
        console.debug(logMessage, logEntry)
        break
      case 'info':
        console.info(logMessage, logEntry)
        break
      case 'warning':
        console.warn(logMessage, logEntry)
        break
      case 'error':
      case 'critical':
        console.error(logMessage, logEntry)
        break
      default:
        console.log(logMessage, logEntry)
    }

    // Envoyer vers Google Cloud Logging
    await sendToGoogleCloudLogging(logEntry)

    // Gestion spéciale des prédictions incorrectes et alertes
    if (level.toUpperCase() === 'WARNING' && data?.event_type === 'incorrect_prediction') {
      // Nettoyer les anciennes erreurs
      cleanOldErrors()
      
      // Ajouter la nouvelle erreur
      recentErrors.push({
        timestamp: logEntry.timestamp,
        level: logEntry.level,
        message: logEntry.message,
        data: logEntry.data
      })

      console.warn('🔥 Prédiction incorrecte détectée:', {
        text: data.text,
        predicted: data.predicted_sentiment,
        actual: data.actual_sentiment,
        confidence: data.confidence,
        userId: data.user_id,
        requestId: data.request_id
      })

      // Vérifier si on doit déclencher une alerte
      if (recentErrors.length >= ALERT_THRESHOLD) {
        console.error(`🚨 SEUIL D'ALERTE ATTEINT: ${recentErrors.length} erreurs en 5 minutes`)
        await sendAlert(recentErrors.length, recentErrors)
        
        // Optionnel: Reset du compteur après alerte pour éviter le spam
        // recentErrors = []
      }
    }

    // Gestion des erreurs critiques (erreurs système)
    if (level.toUpperCase() === 'ERROR' || level.toUpperCase() === 'CRITICAL') {
      cleanOldErrors()
      recentErrors.push({
        timestamp: logEntry.timestamp,
        level: logEntry.level,
        message: logEntry.message,
        data: logEntry.data
      })

      console.error('💥 Erreur système détectée:', {
        error: data.error,
        stack: data.stack,
        context: data.context
      })

      // Alerte immédiate pour les erreurs critiques
      if (level.toUpperCase() === 'CRITICAL') {
        await sendAlert(1, [recentErrors[recentErrors.length - 1]])
      }
    }

    // Tracking des événements positifs (prédictions correctes)
    if (level.toUpperCase() === 'INFO' && data?.event_type === 'correct_prediction') {
      console.info('✅ Prédiction correcte confirmée:', {
        text: data.text,
        predicted: data.predicted_sentiment,
        confidence: data.confidence,
        userId: data.user_id,
        requestId: data.request_id
      })
    }

    // Métriques de performance
    if (data?.performance_metrics) {
      console.info('📊 Métriques de performance:', {
        responseTime: data.performance_metrics.responseTime,
        modelLoadTime: data.performance_metrics.modelLoadTime,
        predictionTime: data.performance_metrics.predictionTime
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Log traité avec succès',
      logId: `log_${logEntry.timestamp}`,
      recentErrorCount: recentErrors.length,
      alertThreshold: ALERT_THRESHOLD,
      metadata: {
        timestamp: new Date(logEntry.timestamp).toISOString(),
        projectId: logEntry.projectId,
        logName: logEntry.logName
      }
    })

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
    const errorStack = error instanceof Error ? error.stack : undefined
    
    console.error('💥 Erreur critique dans le système de logging:', {
      error: errorMessage,
      stack: errorStack,
      timestamp: new Date().toISOString()
    })

    // Même en cas d'erreur du système de logging, on essaie d'envoyer une alerte
    try {
      await sendAlert(1, [{
        timestamp: Date.now(),
        level: 'CRITICAL',
        message: 'Erreur dans le système de logging',
        data: { error: errorMessage, stack: errorStack }
      }])
    } catch (alertError) {
      console.error('💀 Impossible d\'envoyer l\'alerte d\'erreur critique:', alertError)
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur interne du serveur de logging',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    )
  }
}

// Endpoint GET pour récupérer les statistiques de logging
export async function GET(request: NextRequest) {
  try {
    cleanOldErrors()
    
    const stats = {
      recentErrorCount: recentErrors.length,
      alertThreshold: ALERT_THRESHOLD,
      timeWindowMinutes: ALERT_TIME_WINDOW_MS / (60 * 1000),
      projectId: PROJECT_ID,
      recentErrors: recentErrors.map(error => ({
        timestamp: new Date(error.timestamp).toISOString(),
        level: error.level,
        message: error.message,
        eventType: error.data?.event_type
      })),
      systemStatus: {
        googleCloudLoggingEnabled: !!(process.env.GOOGLE_CLOUD_LOGGING_API_KEY || process.env.NEXT_PUBLIC_API_URL),
        alertWebhookEnabled: !!process.env.ALERT_WEBHOOK_URL,
        environment: process.env.NODE_ENV || 'development'
      }
    }

    return NextResponse.json(stats)
    
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    )
  }
}
