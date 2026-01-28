import { motion } from 'framer-motion'
import {
  Box,
  Stack,
  Typography,
  Paper,
} from '@mui/material'
import {
  FiberManualRecord,
  CheckCircle,
  LocalShipping,
  Schedule,
} from '@mui/icons-material'

/**
 * Tracking Timeline Component
 * Animated vertical timeline showing tracking events with Framer Motion
 */
function TrackingTimeline({ events }) {
  const getEventIcon = (index, status) => {
    const statusLower = status.toLowerCase()
    
    // First event (most recent) gets special treatment
    if (index === 0) {
      if (statusLower.includes('delivered')) {
        return <CheckCircle sx={{ color: 'success.main', fontSize: 28 }} />
      }
      return <LocalShipping sx={{ color: 'warning.main', fontSize: 28 }} />
    }

    // Other events
    if (statusLower.includes('delivered')) {
      return <CheckCircle sx={{ color: 'success.light', fontSize: 24 }} />
    }

    return <FiberManualRecord sx={{ color: 'text.disabled', fontSize: 16 }} />
  }

  const getEventColor = (index) => {
    if (index === 0) return 'primary.main'
    return 'text.disabled'
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      return date.toLocaleString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return dateString
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
      >
        <Stack spacing={0}>
          {events.map((event, index) => (
            <motion.div key={index} variants={item}>
              <Box
                sx={{
                  position: 'relative',
                  pb: index === events.length - 1 ? 0 : 4,
                }}
              >
                {/* Timeline line */}
                {index !== events.length - 1 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      left: '13px',
                      top: '28px',
                      bottom: 0,
                      width: '2px',
                      backgroundColor: index === 0 ? 'primary.main' : 'divider',
                      opacity: index === 0 ? 0.5 : 0.3,
                    }}
                  />
                )}

                {/* Event content */}
                <Stack direction="row" spacing={2}>
                  {/* Icon */}
                  <Box
                    sx={{
                      position: 'relative',
                      zIndex: 1,
                      mt: 0.5,
                    }}
                  >
                    {getEventIcon(index, event.status)}
                  </Box>

                  {/* Event details */}
                  <Paper
                    elevation={index === 0 ? 2 : 0}
                    sx={{
                      flex: 1,
                      p: 2,
                      borderRadius: 2,
                      backgroundColor:
                        index === 0 ? 'background.paper' : 'transparent',
                      border: index === 0 ? 'none' : '1px solid transparent',
                      transition: 'all 0.2s',
                      '&:hover': {
                        backgroundColor: 'background.paper',
                        borderColor: 'divider',
                        boxShadow: 1,
                      },
                    }}
                  >
                    <Stack spacing={0.5}>
                      <Typography
                        variant="body1"
                        fontWeight={index === 0 ? 600 : 500}
                        color={index === 0 ? 'text.primary' : 'text.secondary'}
                      >
                        {event.status}
                      </Typography>

                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={{ xs: 0.5, sm: 2 }}
                        sx={{ opacity: 0.8 }}
                      >
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <Schedule sx={{ fontSize: 16, color: 'text.disabled' }} />
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(event.timestamp)}
                          </Typography>
                        </Stack>

                        {event.location && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            📍 {event.location}
                          </Typography>
                        )}
                      </Stack>
                    </Stack>
                  </Paper>
                </Stack>
              </Box>
            </motion.div>
          ))}
        </Stack>
      </motion.div>

      {/* Empty state */}
      {events.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography color="text.secondary">
            No tracking events available
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default TrackingTimeline
