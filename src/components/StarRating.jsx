import Box from '@mui/material/Box'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'

export default function StarRating({ value = 0, max = 5, size = 'small' }) {
  return (
    <Box sx={{ display: 'flex', gap: 0.25 }}>
      {Array.from({ length: max }, (_, i) =>
        i < value ? (
          <StarIcon key={i} fontSize={size} sx={{ color: '#FF8F00' }} />
        ) : (
          <StarBorderIcon key={i} fontSize={size} sx={{ color: '#BDBDBD' }} />
        )
      )}
    </Box>
  )
}
