import { motion } from 'framer-motion'
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Stack,
} from '@mui/material'
import { LocalShipping } from '@mui/icons-material'

/**
 * Loading State Component
 * Animated loading indicator while fetching tracking data
 */
function LoadingState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Paper
        elevation={2}
        sx={{
          p: 6,
          textAlign: 'center',
          borderRadius: 3,
          backgroundColor: 'background.paper',
        }}
      >
        <Stack spacing={3} alignItems="center">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <LocalShipping
              sx={{ fontSize: 60, color: 'primary.main' }}
            />
          </motion.div>

          <CircularProgress size={40} thickness={4} />

          <Box>
            <Typography variant="h6" gutterBottom color="text.primary">
              Tracking Your Parcel...
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Fetching the latest information from India Post
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </motion.div>
  )
}

export default LoadingState
