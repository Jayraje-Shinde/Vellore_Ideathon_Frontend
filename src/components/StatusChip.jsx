import Chip from '@mui/material/Chip'
import ScheduleIcon from '@mui/icons-material/Schedule'
import EngineeringIcon from '@mui/icons-material/Engineering'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

const cfg = {
  pending: {
    label: 'Pending',
    color: 'warning',
    Icon: ScheduleIcon,
  },
  in_consultation: {
    label: 'In Consultation',
    color: 'primary',
    Icon: EngineeringIcon,
  },
  completed: {
    label: 'Completed',
    color: 'success',
    Icon: CheckCircleIcon,
  },
}

export default function StatusChip({ status, size = 'small' }) {
  const { label, color, Icon } = cfg[status] || cfg.pending
  return (
    <Chip
      label={label}
      color={color}
      size={size}
      variant="outlined"
      icon={<Icon sx={{ fontSize: '14px !important' }} />}
      sx={{ fontWeight: 500 }}
    />
  )
}
