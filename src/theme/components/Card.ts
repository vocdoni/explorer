import { cardAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers, theme } from '@chakra-ui/react'

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

const link = definePartsStyle((props) => {
  const _hover = {
    color: 'accent1',
  }
  return {
    ...baseStyle,
    ...theme.components.Card.variants?.elevated,
    container: {
      _hover: {
        ..._hover,
        boxShadow: 'var(--box-shadow-darker)',
        transition: 'box-shadow .2s',
      },
      ...baseStyle.container,
      ...theme.components.Card.variants?.elevated.container,
    },
    header: {
      ...baseStyle.header,
      transition: 'color .2s',
      _hover,
    },
    body: {
      ...baseStyle.body,
      transition: 'color .2s',
      _hover,
    },
    footer: {
      _hover,
    },
  }
})

const variants = {
  link,
}

const Card = defineMultiStyleConfig({ baseStyle, variants })

export default Card
