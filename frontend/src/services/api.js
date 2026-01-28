import axios from 'axios'

/**
 * API Configuration
 * Base URL for backend API
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Track consignment by tracking number
 * 
 * @param {string} trackingNumber - Tracking number
 * @param {string} carrier - Carrier code (india-post, delhivery, bluedart, dtdc, ecom-express)
 * @returns {Promise<Object>} Tracking data
 * @throws {Error} API error with user-friendly message
 */
export const trackConsignment = async (trackingNumber, carrier = 'india-post') => {
  try {
    const response = await apiClient.get(`/api/track/${trackingNumber}`, {
      params: { carrier }
    })
    return response.data
  } catch (error) {
    // Handle different error types
    if (error.response) {
      // Server responded with error
      const status = error.response.status
      const message = error.response.data?.message || error.response.data?.detail

      if (status === 404) {
        throw new Error(message || 'Tracking number not found. Please verify and try again.')
      } else if (status === 400) {
        throw new Error(message || 'Invalid tracking number format.')
      } else if (status === 500) {
        throw new Error('Server error. Please try again later.')
      } else {
        throw new Error(message || 'An unexpected error occurred.')
      }
    } else if (error.request) {
      // Request made but no response
      throw new Error('Unable to connect to the server. Please check your connection.')
    } else {
      // Something else happened
      throw new Error('An unexpected error occurred. Please try again.')
    }
  }
}

/**
 * Health check endpoint
 * 
 * @returns {Promise<Object>} API status
 */
export const healthCheck = async () => {
  try {
    const response = await apiClient.get('/')
    return response.data
  } catch (error) {
    throw new Error('API is unavailable')
  }
}

/**
 * Get supported carriers
 * 
 * @returns {Promise<Array>} List of supported carriers
 */
export const getSupportedCarriers = async () => {
  try {
    const response = await apiClient.get('/api/carriers')
    return response.data.carriers
  } catch (error) {
    console.error('Failed to fetch carriers:', error)
    // Return default carriers if API fails
    return [
      { code: 'india-post', name: 'India Post', icon: '🇮🇳' },
      { code: 'delhivery', name: 'Delhivery', icon: '📦' },
      { code: 'bluedart', name: 'Blue Dart', icon: '✈️' },
      { code: 'dtdc', name: 'DTDC', icon: '🚚' },
      { code: 'ecom-express', name: 'Ecom Express', icon: '🛒' },
      { code: 'ekart', name: 'Ekart Logistics', icon: '🎯' },
    ]
  }
}

export default apiClient
