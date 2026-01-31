import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material'
import {
  LocalShipping,
  Search,
  ArrowBack,
} from '@mui/icons-material'
import { trackConsignment } from '../services/api'
import TrackingResult from '../components/TrackingResult'
import LoadingState from '../components/LoadingState'
import ThemeToggle from '../components/ThemeToggle'
import { addRecentSearch } from '../utils/storage'

/**
 * Tracking Page Component
 * Main tracking interface with search and results
 */
function TrackingPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialNumber = searchParams.get('number') || ''
  const initialCarrier = searchParams.get('carrier') || 'india-post'

  const [trackingNumber, setTrackingNumber] = useState(initialNumber)
  const [carrier, setCarrier] = useState(initialCarrier)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [trackingData, setTrackingData] = useState(null)
  const [lastRefreshed, setLastRefreshed] = useState(null)

  // Auto-track if tracking number is provided in URL
  useEffect(() => {
    if (initialNumber) {
      handleTrack(initialNumber, initialCarrier)
    }
  }, [])

  const handleTrack = async (number = trackingNumber, selectedCarrier = carrier) => {
    if (!number.trim()) {
      setError('Please enter a tracking number')
      return
    }

    if (number.length < 8) {
      setError('Invalid tracking number format')
      return
    }

    setLoading(true)
    setError(null)
    setTrackingData(null)

    try {
      const data = await trackConsignment(number, selectedCarrier)
      setTrackingData(data)
      setLastRefreshed(new Date())
      addRecentSearch(number)
      
      // Update URL with tracking number and carrier
      navigate(`/track?number=${encodeURIComponent(number)}&carrier=${selectedCarrier}`, { replace: true })
    } catch (err) {
      // Show user-friendly error messages
      const errorMessage = err.message || 'Failed to fetch tracking information'
      setError(errorMessage)
      
      // If it's a cold start timeout, show helpful message
      if (errorMessage.includes('starting up') || errorMessage.includes('waking up')) {
        console.log('Backend cold start detected - this is normal on first request after inactivity')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleTrack()
    }
  }

  const handleNewSearch = () => {
    setTrackingNumber('')
    setTrackingData(null)
    setError(null)
    setLastRefreshed(null)
    navigate('/track')
  }

  const handleRefresh = () => {
    if (trackingNumber) {
      handleTrack(trackingNumber)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          backgroundColor: 'primary.main',
          color: 'white',
          py: 2,
          boxShadow: 2,
        }}
      >
        <Container maxWidth="lg">
          <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={2}>
              <IconButton
                onClick={() => navigate('/')}
                sx={{ color: 'white' }}
              >
                <ArrowBack />
              </IconButton>
              <LocalShipping fontSize="large" />
              <Typography
                variant="h5"
                component="h1"
                sx={{ fontWeight: 700, fontFamily: 'Poppins' }}
              >
                DakDash
              </Typography>
            </Stack>
            <ThemeToggle />
          </Stack>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
        {/* Search Bar */}
        <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter tracking number"
              value={trackingNumber}
              onChange={(e) => {
                setTrackingNumber(e.target.value)
                setError(null)
              }}
              onKeyPress={handleKeyPress}
              disabled={loading}
              InputProps={{
                sx: {
                  fontFamily: 'monospace',
                  fontSize: '1rem',
                },
              }}
            />
            <Button
              variant="contained"
              onClick={() => handleTrack()}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <Search />}
              sx={{
                minWidth: { xs: '100%', sm: '150px' },
                py: 1.5,
              }}
            >
              {loading ? 'Tracking...' : 'Track'}
            </Button>
          </Stack>
        </Paper>

        {/* Loading State */}
        {loading && <LoadingState />}

        {/* Error State */}
        {error && !loading && (
          <Alert
            severity="error"
            sx={{ mb: 3, borderRadius: 2 }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {/* Tracking Results */}
        {trackingData && !loading && (
          <TrackingResult 
            data={trackingData} 
            onNewSearch={handleNewSearch}
            onRefresh={handleRefresh}
            lastRefreshed={lastRefreshed}
          />
        )}

        {/* Empty State */}
        {!loading && !error && !trackingData && (
          <Paper
            elevation={1}
            sx={{
              p: 6,
              textAlign: 'center',
              borderRadius: 3,
              backgroundColor: 'background.paper',
            }}
          >
            <LocalShipping
              sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Enter a tracking number to get started
            </Typography>
            <Typography variant="body2" color="text.disabled">
              We'll fetch the latest tracking information for your parcel
            </Typography>
          </Paper>
        )}
      </Container>
    </Box>
  )
}

export default TrackingPage
