/**
 * LocalStorage utility for managing recent tracking searches
 */

const STORAGE_KEY = 'dakdash-recent-searches'
const MAX_RECENT = 10

export const getRecentSearches = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error reading recent searches:', error)
    return []
  }
}

export const addRecentSearch = (trackingNumber) => {
  try {
    const recent = getRecentSearches()
    
    // Remove if already exists (to move to top)
    const filtered = recent.filter(num => num !== trackingNumber)
    
    // Add to beginning
    const updated = [trackingNumber, ...filtered].slice(0, MAX_RECENT)
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    return updated
  } catch (error) {
    console.error('Error saving recent search:', error)
    return []
  }
}

export const clearRecentSearches = () => {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Error clearing recent searches:', error)
  }
}
