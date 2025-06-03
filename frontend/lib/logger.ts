/**
 * Utilitaire de logging pour Air Paradis Sentiment Analysis
 * Envoie les logs vers l'API backend via le proxy Next.js
 */

interface LogData {
  event_type?: string;
  text?: string;
  predicted_sentiment?: string;
  actual_sentiment?: string;
  confidence?: number;
  user_id?: string;
  request_id?: string;
  error?: string;
  stack?: string;
  context?: any;
  is_correct?: boolean;
  performance_metrics?: {
    responseTime?: number;
    modelLoadTime?: number;
    predictionTime?: number;
  };

    // --- AJOUTS POUR LE TEST DE STRESS ET AUTRES LOGS SIMILAIRES ---
    stress_test?: boolean;
    iteration?: number;
    timestamp?: number;
}

interface LogEntry {
  level: 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  message: string;
  data?: LogData;
  timestamp?: number;
  projectId?: string;
  logName?: string;
}

class Logger {
  private projectId: string;
  private isEnabled: boolean;

  constructor() {
    this.projectId = process.env.NEXT_PUBLIC_GOOGLE_CLOUD_PROJECT || 'air-paradis-sentiment';
    this.isEnabled = process.env.NEXT_PUBLIC_MONITORING_ENABLED === 'true';
  }

  /**
   * Envoie un log vers l'API backend via le proxy Next.js
   */
  private async sendLog(entry: LogEntry): Promise<void> {
    if (!this.isEnabled) {
      console.log('[LOGGER DISABLED]', entry);
      return;
    }

    try {
      // **ENVOI UNIQUEMENT VERS L'ENDPOINT NEXT.JS QUI REDIRIGE VERS LE BACKEND**
      // Ceci évite la double redirection et centralise la logique dans route.ts
      const response = await fetch('/api/logging', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...entry,
          projectId: this.projectId,
          timestamp: entry.timestamp || Date.now(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Logging failed: ${response.status} - ${response.statusText}`);
      }

      const result = await response.json();
      
      // Log de succès en mode développement
      if (process.env.NODE_ENV === 'development') {
        console.debug('[LOGGER SUCCESS]', {
          logId: result.logId,
          source: result.source,
          recentErrorCount: result.recentErrorCount,
          alertThreshold: result.alertThreshold
        });
      }

    } catch (error) {
      console.error('❌ Logging failed:', error);
      // Fallback vers console.log local uniquement
      console.log('[FALLBACK LOG]', entry);
    }
  }

  /**
   * Log de debug
   */
  debug(message: string, data?: LogData): void {
    console.debug(`[DEBUG] ${message}`, data);
    this.sendLog({
      level: 'DEBUG',
      message,
      data,
    });
  }

  /**
   * Log d'information
   */
  info(message: string, data?: LogData): void {
    console.info(`[INFO] ${message}`, data);
    this.sendLog({
      level: 'INFO',
      message,
      data,
    });
  }

  /**
   * Log d'avertissement
   */
  warning(message: string, data?: LogData): void {
    console.warn(`[WARNING] ${message}`, data);
    this.sendLog({
      level: 'WARNING',
      message,
      data,
    });
  }

  /**
   * Log d'erreur
   */
  error(message: string, data?: LogData): void {
    console.error(`[ERROR] ${message}`, data);
    this.sendLog({
      level: 'ERROR',
      message,
      data,
    });
  }

  /**
   * Log critique
   */
  critical(message: string, data?: LogData): void {
    console.error(`[CRITICAL] ${message}`, data);
    this.sendLog({
      level: 'CRITICAL',
      message,
      data,
    });
  }

  /**
   * Log spécifique pour les prédictions correctes
   */
  logCorrectPrediction(text: string, sentiment: string, confidence: number, requestId?: string, userId?: string): void {
    this.info('Prédiction correcte confirmée par l\'utilisateur', {
      event_type: 'correct_prediction',
      text,
      predicted_sentiment: sentiment,
      confidence,
      request_id: requestId,
      user_id: userId,
    });
  }

  /**
   * Log spécifique pour les prédictions incorrectes (déclenche une alerte)
   */
  logIncorrectPrediction(
    text: string, 
    predictedSentiment: string, 
    actualSentiment: string, 
    confidence: number, 
    requestId?: string, 
    userId?: string
  ): void {
    this.warning('Prédiction incorrecte signalée par l\'utilisateur', {
      event_type: 'incorrect_prediction',
      text,
      predicted_sentiment: predictedSentiment,
      actual_sentiment: actualSentiment,
      confidence,
      request_id: requestId,
      user_id: userId,
    });
  }

  /**
   * Log des métriques de performance
   */
  logPerformanceMetrics(metrics: {
    responseTime?: number;
    modelLoadTime?: number;
    predictionTime?: number;
  }): void {
    this.info('Métriques de performance', {
      performance_metrics: metrics,
    });
  }

  /**
   * Log des erreurs d'API
   */
  logApiError(endpoint: string, error: Error, context?: any): void {
    this.error(`Erreur API sur ${endpoint}`, {
      error: error.message,
      stack: error.stack,
      context: {
        endpoint,
        ...context,
      },
    });
  }

  /**
   * Log des erreurs de l'interface utilisateur
   */
  logUIError(component: string, error: Error, context?: any): void {
    this.error(`Erreur UI dans ${component}`, {
      error: error.message,
      stack: error.stack,
      context: {
        component,
        ...context,
      },
    });
  }

  /**
   * Log de démarrage de l'application
   */
  logAppStart(): void {
    this.info('Application Air Paradis Sentiment UI démarrée', {
      context: {
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      },
    });
  }

  /**
   * Log des actions utilisateur
   */
  logUserAction(action: string, data?: any): void {
    this.info(`Action utilisateur: ${action}`, {
      context: {
        action,
        data,
        timestamp: new Date().toISOString(),
      },
    });
  }
}

// Instance singleton
const logger = new Logger();

export default logger;

// Export des types pour utilisation dans d'autres composants
export type { LogData, LogEntry };
