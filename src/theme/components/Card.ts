import { cardAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(cardAnatomy.keys)

const baseStyle = definePartsStyle({
  container: {
    borderRadius: 'xl',
  },
  header: {
    fontSize: 'xl',
    fontWeight: 600,
    color: 'gray.600',
  },
  body: {
    color: 'gray.600',
  },
})

const Card = defineMultiStyleConfig({ baseStyle })

export default Card
