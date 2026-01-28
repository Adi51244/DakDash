/**
 * Theme context for dark mode toggle
 */
import { createContext, useContext, useState, useMemo, useEffect } from 'react'
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from './theme'
import darkTheme from './themeDark'

const ThemeContext = createContext()

export const useThemeMode = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useThemeMode must be used within ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  // Load theme preference from localStorage
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('dakdash-theme')
    return savedMode || 'light'
  })

  // Save theme preference when it changes
  useEffect(() => {
    localStorage.setItem('dakdash-theme', mode)
  }, [mode])

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
  }

  const currentTheme = useMemo(
    () => (mode === 'dark' ? darkTheme : theme),
    [mode]
  )

  const value = {
    mode,
    toggleTheme,
  }

  return (
    <ThemeContext.Provider value={value}>
      <MUIThemeProvider theme={currentTheme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  )
}
