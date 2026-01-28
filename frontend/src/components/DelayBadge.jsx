import { Chip, Tooltip } from '@mui/material'
import {
  Warning,
  Error as ErrorIcon,
  CheckCircle,
  Info,
} from '@mui/icons-material'

/**
 * Delay Badge Component
 * Shows delay status with appropriate color and icon
 */
function DelayBadge({ delayInfo }) {
  if (!delayInfo || delayInfo.status === 'Normal') {
    return (
      <Tooltip title="Shipment is on track">
        <Chip
          icon={<CheckCircle />}
          label="On Track"
          size="small"
          sx={{
            backgroundColor: 'success.light',
            color: 'success.contrastText',
            fontWeight: 600,
          }}
        />
      </Tooltip>
    )
  }

  const getStatusConfig = () => {
    switch (delayInfo.severity) {
      case 'high':
        return {
          icon: <ErrorIcon />,
          color: 'error',
          bgColor: 'error.light',
          tooltip: delayInfo.message,
        }
      case 'medium':
        return {
          icon: <Warning />,
          color: 'warning',
          bgColor: 'warning.light',
          tooltip: delayInfo.message,
        }
      case 'low':
        return {
          icon: <Info />,
          color: 'info',
          bgColor: 'info.light',
          tooltip: delayInfo.message,
        }
      default:
        return {
          icon: <CheckCircle />,
          color: 'success',
          bgColor: 'success.light',
          tooltip: 'On track',
        }
    }
  }

  const config = getStatusConfig()

  return (
    <Tooltip title={config.tooltip}>
      <Chip
        icon={config.icon}
        label={delayInfo.status}
        size="small"
        sx={{
          backgroundColor: config.bgColor,
          color: `${config.color}.contrastText`,
          fontWeight: 600,
          border: `1px solid`,
          borderColor: `${config.color}.main`,
        }}
      />
    </Tooltip>
  )
}

export default DelayBadge
