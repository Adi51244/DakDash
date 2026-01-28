import { motion } from 'framer-motion'
import { Paper, Typography, Box, Stack } from '@mui/material'
import { Lightbulb } from '@mui/icons-material'

/**
 * Smart Summary Card
 * Displays AI-generated natural language summary of shipment status
 */
function SmartSummary({ summary }) {
  if (!summary) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          mb: 3,
        }}
      >
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Lightbulb sx={{ fontSize: 32, mt: 0.5 }} />
          <Box>
            <Typography
              variant="caption"
              sx={{
                opacity: 0.9,
                textTransform: 'uppercase',
                letterSpacing: 1,
                fontWeight: 600,
              }}
            >
              Smart Insight
            </Typography>
            <Typography variant="h6" sx={{ mt: 0.5, fontWeight: 500 }}>
              {summary}
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </motion.div>
  )
}

export default SmartSummary
