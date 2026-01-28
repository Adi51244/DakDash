import { IconButton, Tooltip } from '@mui/material'
import { Brightness4, Brightness7 } from '@mui/icons-material'
import { useThemeMode } from '../ThemeContext'

/**
 * Dark Mode Toggle Button
 * Switches between light and dark themes
 */
function ThemeToggle() {
  const { mode, toggleTheme } = useThemeMode()

  return (
    <Tooltip title={mode === 'dark' ? 'Light Mode' : 'Dark Mode'}>
      <IconButton
        onClick={toggleTheme}
        sx={{
          color: mode === 'dark' ? 'white' : 'white',
        }}
      >
        {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Tooltip>
  )
}

export default ThemeToggle
