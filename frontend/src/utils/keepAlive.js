/**
 * Keep-Alive Service
 * Pings the backend every 10 minutes to prevent Render cold starts
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

let keepAliveInterval = null

/**
 * Start keep-alive pings to prevent backend from sleeping
 */
export const startKeepAlive = () => {
  // Don't ping localhost
  if (API_BASE_URL.includes('localhost')) {
    return
  }

  // Ping immediately on start
  pingBackend()

  // Then ping every 10 minutes (600000ms)
  keepAliveInterval = setInterval(() => {
    pingBackend()
  }, 600000)

  console.log('🏓 Keep-alive service started')
}

/**
 * Stop keep-alive pings
 */
export const stopKeepAlive = () => {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval)
    keepAliveInterval = null
    console.log('🛑 Keep-alive service stopped')
  }
}

/**
 * Ping the backend health endpoint
 */
const pingBackend = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/`, {
      method: 'GET',
      signal: AbortSignal.timeout(10000), // 10 second timeout
    })
    
    if (response.ok) {
      console.log('✅ Backend is alive')
    }
  } catch (error) {
    console.log('⚠️ Keep-alive ping failed (backend may be sleeping)')
  }
}
