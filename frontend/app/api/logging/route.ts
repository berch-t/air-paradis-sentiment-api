import { NextRequest, NextResponse } from 'next/server'

// Configuration de base
const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT || 'air-paradis-sentiment'
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://air-paradis-sentiment-api-qxumenjqxq-ew.a.run.app'

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

    // Log local pour debug (garde uniquement pour développement)
    if (process.env.NODE_ENV === 'development') {
      const logMessage = `[FRONTEND->BACKEND] ${level.toUpperCase()}: ${message}`
      
      switch (level.toLowerCase()) {
        case 'debug':
          console.debug(logMessage, data)
          break
        case 'info':
          console.info(logMessage, data)
          break
        case 'warning':
          console.warn(logMessage, data)
          break
        case 'error':
        case 'critical':
          console.error(logMessage, data)
          break
        default:
          console.log(logMessage, data)
      }
    }

    // **REDIRECTION SYSTEMATIQUE VERS L'API BACKEND FASTAPI**
    // C'est là que se trouve la vraie logique de monitoring et d'alertes
    try {
      const backendLogUrl = `${API_URL}/api/logging`
      
      // Enrichir les données avec des infos du frontend
      const enrichedLogEntry = {
        level: level.toUpperCase(),
        message,
        data: {
          ...data,
          frontend_source: true,
          user_agent: request.headers.get('user-agent'),
          ip: request.headers.get('x-forwarded-for') || 
              request.headers.get('x-real-ip') || 
              'unknown',
          timestamp_frontend: new Date().toISOString()
        },
        timestamp: timestamp || Date.now(),
        projectId: projectId || PROJECT_ID,
        logName: logName || 'air-paradis-frontend'
      }

      // Envoi vers l'API FastAPI backend
      const backendResponse = await fetch(backendLogUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'User-Agent': 'Air-Paradis-Frontend/1.0.0'
        },
        body: JSON.stringify(enrichedLogEntry),
        // Timeout de 10 secondes
        signal: AbortSignal.timeout(10000)
      })

      if (!backendResponse.ok) {
        throw new Error(`Backend API error: ${backendResponse.status} - ${backendResponse.statusText}`)
      }

      const backendResult = await backendResponse.json()
      
      // Log de succès en développement
      if (process.env.NODE_ENV === 'development') {
        console.info('✅ Log envoyé avec succès vers l\'API backend:', {
          logId: backendResult.logId,
          recentErrorCount: backendResult.recentErrorCount,
          alertThreshold: backendResult.alertThreshold
        })
      }

      // Retourner la réponse du backend (qui contient la vraie logique d'alertes)
      return NextResponse.json({
        success: true,
        message: 'Log traité avec succès par le backend',
        source: 'backend-fastapi',
        logId: backendResult.logId || `frontend_proxy_${Date.now()}`,
        recentErrorCount: backendResult.recentErrorCount || 0,
        alertThreshold: backendResult.alertThreshold || 3,
        metadata: {
          frontend_timestamp: new Date().toISOString(),
          backend_response: backendResult.metadata || {},
          proxy_via: 'nextjs-frontend'
        }
      })

    } catch (backendError) {
      // En cas d'erreur du backend, on log l'erreur mais on ne fait pas échouer la requête
      const errorMessage = backendError instanceof Error ? backendError.message : 'Erreur backend inconnue'
      
      console.error('❌ Erreur lors de l\'envoi vers l\'API backend:', {
        error: errorMessage,
        url: `${API_URL}/api/logging`,
        originalRequest: { level, message }
      })

      // Fallback : retourner une réponse d'erreur mais avec status 200 pour ne pas casser le frontend
      return NextResponse.json({
        success: false,
        message: 'Erreur backend : log traité localement',
        source: 'frontend-fallback',
        logId: `frontend_fallback_${Date.now()}`,
        recentErrorCount: 0,
        alertThreshold: 3,
        metadata: {
          frontend_timestamp: new Date().toISOString(),
          backend_error: errorMessage,
          fallback_mode: true
        }
      })
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
    
    console.error('💥 Erreur critique dans le proxy de logging frontend:', {
      error: errorMessage,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur interne du proxy de logging',
        source: 'frontend-proxy',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    )
  }
}

// Endpoint GET pour récupérer les statistiques depuis le backend
export async function GET(request: NextRequest) {
  try {
    // Rediriger vers le backend pour les vraies statistiques
    const backendStatsUrl = `${API_URL}/metrics`
    
    const backendResponse = await fetch(backendStatsUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Air-Paradis-Frontend/1.0.0'
      },
      signal: AbortSignal.timeout(5000) // Timeout de 5 secondes pour les stats
    })

    if (!backendResponse.ok) {
      throw new Error(`Backend stats error: ${backendResponse.status}`)
    }

    const backendStats = await backendResponse.json()
    
    // Enrichir avec des infos frontend
    const enrichedStats = {
      ...backendStats,
      frontend_info: {
        proxy_via: 'nextjs-frontend',
        environment: process.env.NODE_ENV || 'development',
        api_url: API_URL,
        timestamp: new Date().toISOString()
      }
    }

    return NextResponse.json(enrichedStats)
    
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques backend:', error)
    
    // Fallback : statistiques minimales
    return NextResponse.json({
      recentErrorCount: 0,
      alertThreshold: 3,
      timeWindowMinutes: 5,
      projectId: PROJECT_ID,
      recentErrors: [],
      systemStatus: {
        backendAvailable: false,
        frontendProxyEnabled: true,
        environment: process.env.NODE_ENV || 'development'
      },
      frontend_info: {
        error: 'Backend non disponible',
        fallback_mode: true,
        timestamp: new Date().toISOString()
      }
    })
  }
}
