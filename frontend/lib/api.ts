// API Configuration
export const API_CONFIG = {
  // URL de l'API déployée sur Google Cloud Run
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://air-paradis-sentiment-api-qxumenjqxq-ew.a.run.app',
  ENDPOINTS: {
    PREDICT: '/predict',
    FEEDBACK: '/feedback',
    HEALTH: '/health',
    METRICS: '/metrics'
  },
  TIMEOUT: 30000, // 30 secondes
}

// Google Cloud Logging Configuration (adapted from Azure Application Insights)
export const MONITORING_CONFIG = {
  PROJECT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLOUD_PROJECT || 'air-paradis-sentiment',
  LOG_NAME: 'sentiment-analysis-feedback',
  ENABLED: process.env.NEXT_PUBLIC_MONITORING_ENABLED !== 'false',
}

// Types for API responses
export interface SentimentPrediction {
  text: string
  sentiment: 'positive' | 'negative'
  confidence: number
  probability: number
  model: string
  tokenizer_type: string
  timestamp: string
  request_id?: string
}

export interface FeedbackData {
  text: string
  predicted_sentiment: string
  actual_sentiment: string
  is_correct: boolean
  user_id?: string
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  success: boolean
}

// API Functions
export async function predictSentiment(text: string): Promise<ApiResponse<SentimentPrediction>> {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PREDICT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
      signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    return { data, success: true }
  } catch (error) {
    console.error('Error predicting sentiment:', error)
    return {
      error: error instanceof Error ? error.message : 'Erreur lors de la prédiction',
      success: false
    }
  }
}

export async function submitFeedback(feedbackData: FeedbackData): Promise<ApiResponse<{ message: string; timestamp: string }>> {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FEEDBACK}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedbackData),
      signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    return { data, success: true }
  } catch (error) {
    console.error('Error submitting feedback:', error)
    return {
      error: error instanceof Error ? error.message : 'Erreur lors de l\'envoi du feedback',
      success: false
    }
  }
}

export async function checkApiHealth(): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HEALTH}`, {
      method: 'GET',
      signal: AbortSignal.timeout(10000), // 10 seconds for health check
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    return { data, success: true }
  } catch (error) {
    console.error('Error checking API health:', error)
    return {
      error: error instanceof Error ? error.message : 'Erreur lors de la vérification de l\'API',
      success: false
    }
  }
}

// Google Cloud Logging function (replacing Azure Application Insights)
export async function logToGoogleCloud(level: 'INFO' | 'WARNING' | 'ERROR', message: string, data?: any): Promise<void> {
  if (!MONITORING_CONFIG.ENABLED) {
    console.log(`[${level}] ${message}`, data)
    return
  }

  try {
    // Pour une implémentation complète, vous devriez utiliser le SDK Google Cloud Logging
    // Ici nous simulons avec une API route Next.js
    await fetch('/api/logging', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        level,
        message,
        data,
        timestamp: new Date().toISOString(),
        projectId: MONITORING_CONFIG.PROJECT_ID,
        logName: MONITORING_CONFIG.LOG_NAME,
      }),
    })
  } catch (error) {
    console.error('Failed to log to Google Cloud:', error)
  }
}

// Function to log incorrect predictions (replaces Azure Application Insights traces)
export async function logIncorrectPrediction(
  text: string,
  predictedSentiment: string,
  actualSentiment: string,
  confidence: number
): Promise<void> {
  const logData = {
    text,
    predicted_sentiment: predictedSentiment,
    actual_sentiment: actualSentiment,
    confidence,
    event_type: 'incorrect_prediction',
    user_agent: navigator.userAgent,
    timestamp: new Date().toISOString(),
  }

  await logToGoogleCloud('WARNING', 'Incorrect sentiment prediction detected', logData)
}

// Function to log correct predictions (optional for accuracy tracking)
export async function logCorrectPrediction(
  text: string,
  sentiment: string,
  confidence: number
): Promise<void> {
  const logData = {
    text,
    sentiment,
    confidence,
    event_type: 'correct_prediction',
    timestamp: new Date().toISOString(),
  }

  await logToGoogleCloud('INFO', 'Correct sentiment prediction confirmed', logData)
}
