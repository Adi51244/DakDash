import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Box,
  Paper,
  Typography,
  Stack,
  Chip,
  Divider,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
} from '@mui/material'
import {
  CheckCircle,
  LocalShipping,
  Schedule,
  Error as ErrorIcon,
  Refresh,
  LocationOn,
  Event,
  ContentCopy,
  Check,
} from '@mui/icons-material'
import TrackingTimeline from './TrackingTimeline'
import SmartSummary from './SmartSummary'
import DelayBadge from './DelayBadge'

/**
 * Tracking Result Component
 * Displays comprehensive tracking information with status cards and timeline
 */
function TrackingResult({ data, onNewSearch, onRefresh, lastRefreshed }) {
  const [copied, setCopied] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data.tracking_number)
      setCopied(true)
      setSnackbarOpen(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const formatLastRefreshed = () => {
    if (!lastRefreshed) return ''
    const seconds = Math.floor((new Date() - lastRefreshed) / 1000)
    if (seconds < 10) return 'Just now'
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    return lastRefreshed.toLocaleTimeString()
  }
  const getStatusIcon = (status) => {
    const statusLower = status.toLowerCase()
    if (statusLower.includes('delivered')) {
      return <CheckCircle sx={{ color: 'success.main' }} />
    } else if (statusLower.includes('transit') || statusLower.includes('picked')) {
      return <LocalShipping sx={{ color: 'warning.main' }} />
    } else if (statusLower.includes('exception') || statusLower.includes('failed')) {
      return <ErrorIcon sx={{ color: 'error.main' }} />
    } else {
      return <Schedule sx={{ color: 'text.secondary' }} />
    }
  }

  const getStatusColor = (status) => {
    const statusLower = status.toLowerCase()
    if (statusLower.includes('delivered')) return 'success'
    if (statusLower.includes('transit') || statusLower.includes('picked')) return 'warning'
    if (statusLower.includes('exception') || statusLower.includes('failed')) return 'error'
    return 'default'
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      return date.toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    } catch {
      return dateString
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Stack spacing={3}>
        {/* Smart Summary Card */}
        {data.smart_summary && <SmartSummary summary={data.smart_summary} />}

        {/* Status Header Card */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #C62828 0%, #EF5350 100%)',
            color: 'white',
          }}
        >
          <Stack spacing={2}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
              gap={2}
            >
              <Box>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  Tracking Number
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: 'monospace',
                      fontWeight: 600,
                      letterSpacing: '0.05em',
                    }}
                  >
                    {data.tracking_number}
                  </Typography>
                  <Tooltip title={copied ? 'Copied!' : 'Copy tracking number'}>
                    <IconButton
                      size="small"
                      onClick={handleCopy}
                      sx={{
                        color: 'white',
                        '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                      }}
                    >
                      {copied ? <Check fontSize="small" /> : <ContentCopy fontSize="small" />}
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>

              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                <Chip
                  icon={getStatusIcon(data.status)}
                  label={data.status}
                  sx={{
                    backgroundColor: 'white',
                    color: 'text.primary',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    px: 1,
                  }}
                />
                {data.delay_info && <DelayBadge delayInfo={data.delay_info} />}
              </Stack>
            </Stack>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.3)' }} />

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{ opacity: 0.95 }}
            >
              <Box flex={1}>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  Carrier
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {data.carrier}
                </Typography>
              </Box>

              <Box flex={1}>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  Last Updated
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {formatDate(data.last_updated)}
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Paper>

        {/* Parcel Information Cards */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
              <CardContent>
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <LocationOn color="primary" />
                    <Typography variant="h6" fontWeight={600}>
                      Origin
                    </Typography>
                  </Stack>
                  <Typography variant="body1" color="text.secondary">
                    {data.origin || 'Information not available'}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
              <CardContent>
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <LocationOn color="primary" />
                    <Typography variant="h6" fontWeight={600}>
                      Destination
                    </Typography>
                  </Stack>
                  <Typography variant="body1" color="text.secondary">
                    {data.destination || 'Information not available'}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tracking Timeline */}
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
          <Stack spacing={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Event color="primary" />
                <Typography variant="h6" fontWeight={600}>
                  Tracking Timeline
                </Typography>
              </Stack>

              <Typography variant="caption" color="text.secondary">
                {data.events?.length || 0} events
              </Typography>
            </Stack>

            <Divider />

            {data.events && data.events.length > 0 ? (
              <TrackingTimeline events={data.events} />
            ) : (
              <Box textAlign="center" py={4}>
                <Typography color="text.secondary">
                  No tracking events available yet
                </Typography>
              </Box>
            )}
          </Stack>
        </Paper>

        {/* Action Buttons */}
        <Box textAlign="center">
          <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={onRefresh}
              sx={{ px: 4, py: 1.5 }}
            >
              Refresh
            </Button>
            <Button
              variant="outlined"
              onClick={onNewSearch}
              sx={{ px: 4, py: 1.5 }}
            >
              Track Another Parcel
            </Button>
          </Stack>
          {lastRefreshed && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Last refreshed: {formatLastRefreshed()}
            </Typography>
          )}
        </Box>

        {/* Copy Success Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
            Tracking number copied to clipboard!
          </Alert>
        </Snackbar>
      </Stack>
    </motion.div>
  )
}

export default TrackingResult
