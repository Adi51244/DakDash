import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  Chip,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material'
import {
  LocalShipping,
  Search,
  Speed,
  Security,
  Verified,
  History,
  Clear,
} from '@mui/icons-material'
import ThemeToggle from '../components/ThemeToggle'
import { getRecentSearches, addRecentSearch, clearRecentSearches } from '../utils/storage'
import { getSupportedCarriers } from '../services/api'

/**
 * Landing Page Component
 * Hero section with tracking input and key features
 */
function LandingPage() {
  const navigate = useNavigate()
  const [trackingNumber, setTrackingNumber] = useState('')
  const [carrier, setCarrier] = useState('india-post')
  const [carriers, setCarriers] = useState([])
  const [error, setError] = useState('')
  const [recentSearches, setRecentSearches] = useState([])

  useEffect(() => {
    setRecentSearches(getRecentSearches())
    loadCarriers()
  }, [])

  const loadCarriers = async () => {
    const supportedCarriers = await getSupportedCarriers()
    setCarriers(supportedCarriers)
  }

  const handleTrack = (number = trackingNumber, selectedCarrier = carrier) => {
    if (!number.trim()) {
      setError('Please enter a tracking number')
      return
    }

    if (number.length < 8) {
      setError('Invalid tracking number format')
      return
    }

    addRecentSearch(number)
    navigate(`/track?number=${encodeURIComponent(number)}&carrier=${selectedCarrier}`)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleTrack()
    }
  }

  const handleClearHistory = () => {
    clearRecentSearches()
    setRecentSearches([])
  }

  const features = [
    {
      icon: <Speed fontSize="large" />,
      title: 'Real-Time Tracking',
      description: 'Get instant updates on your parcel location',
    },
    {
      icon: <Security fontSize="large" />,
      title: 'Secure & Reliable',
      description: 'Your tracking data is safe and encrypted',
    },
    {
      icon: <Verified fontSize="large" />,
      title: 'Official Data',
      description: 'Powered by India Post official tracking',
    },
  ]

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
          <Stack direction="row" alignItems="center" spacing={1} justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={1}>
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

      {/* Hero Section */}
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box textAlign="center" mb={6}>
            <Typography
              variant="h2"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                color: 'text.primary',
                mb: 2,
              }}
            >
              Track Your India Post Parcel
              <br />
              <Box component="span" sx={{ color: 'primary.main' }}>
                in Seconds
              </Box>
            </Typography>

            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ mb: 4, fontWeight: 400 }}
            >
              Enter your consignment number to get real-time tracking updates
            </Typography>

            {/* Tracking Input */}
            <Paper
              elevation={4}
              sx={{
                p: 4,
                borderRadius: 3,
              }}
            >
              <Stack spacing={2}>
                {/* Carrier Selection */}
                <FormControl fullWidth>
                  <InputLabel>Select Carrier</InputLabel>
                  <Select
                    value={carrier}
                    label="Select Carrier"
                    onChange={(e) => setCarrier(e.target.value)}
                  >
                    {carriers.map((c) => (
                      <MenuItem key={c.code} value={c.code}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <span>{c.icon}</span>
                          <span>{c.name}</span>
                        </Stack>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Enter tracking number (e.g., RM123456789IN)"
                  value={trackingNumber}
                  onChange={(e) => {
                    setTrackingNumber(e.target.value)
                    setError('')
                  }}
                  onKeyPress={handleKeyPress}
                  error={!!error}
                  helperText={error}
                  InputProps={{
                    sx: {
                      fontFamily: 'monospace',
                      fontSize: '1.1rem',
                    },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />

                <Button
                  variant="contained"
                  size="large"
                  onClick={() => handleTrack()}
                  startIcon={<Search />}
                  sx={{
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                  }}
                >
                  Track Consignment
                </Button>

                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <History fontSize="small" color="action" />
                        <Typography variant="caption" color="text.secondary">
                          Recent Searches
                        </Typography>
                      </Stack>
                      <IconButton size="small" onClick={handleClearHistory} title="Clear history">
                        <Clear fontSize="small" />
                      </IconButton>
                    </Stack>
                    <List dense sx={{ bgcolor: 'background.default', borderRadius: 1 }}>
                      {recentSearches.slice(0, 5).map((number, index) => (
                        <ListItem key={index} disablePadding>
                          <ListItemButton onClick={() => handleTrack(number)}>
                            <ListItemText
                              primary={number}
                              sx={{ fontFamily: 'monospace' }}
                            />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                <Divider sx={{ my: 2 }} />

                <Stack
                  direction="row"
                  spacing={1}
                  justifyContent="center"
                  flexWrap="wrap"
                  sx={{ pt: 1 }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Examples:
                  </Typography>
                  {['RM123456789IN', 'RN123456789IN', 'CP123456789IN'].map(
                    (example) => (
                      <Chip
                        key={example}
                        label={example}
                        size="small"
                        onClick={() => setTrackingNumber(example)}
                        sx={{
                          cursor: 'pointer',
                          fontFamily: 'monospace',
                          fontSize: '0.75rem',
                        }}
                      />
                    )
                  )}
                </Stack>
              </Stack>
            </Paper>
          </Box>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Box sx={{ mt: 8, mb: 8 }}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={3}
              justifyContent="center"
            >
              {features.map((feature, index) => (
                <Paper
                  key={index}
                  elevation={2}
                  sx={{
                    p: 3,
                    flex: 1,
                    textAlign: 'center',
                    borderRadius: 3,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <Box sx={{ color: 'primary.main', mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </Box>
        </motion.div>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          backgroundColor: 'background.paper',
          py: 3,
          mt: 8,
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
          >
            © 2026 DakDash. Powered by TrackingMore API. India Post is a
            trademark of the Government of India.
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}

export default LandingPage
