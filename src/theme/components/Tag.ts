import { tagAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(tagAnatomy.keys)

const vocdoniStatusBadge = definePartsStyle({
  container: {
    padding: '4px 12px',
    borderRadius: '4px',
    height: '18px',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: '12px',
    lineHeight: '150%',
    color: '#fff',
    bg: 'rgb(35, 114, 116)',
  },
})

const Tag = defineMultiStyleConfig({
  variants: {
    vocdoni: vocdoniStatusBadge,
  },
})

export default Tag
