import { createMultiStyleConfigHelpers } from '@chakra-ui/react'
import { resultsAnatomy } from '@vocdoni/chakra-components'

const { defineMultiStyleConfig, definePartsStyle } = createMultiStyleConfigHelpers(resultsAnatomy)

const baseStyle = definePartsStyle({
  question: {
    p: 4,
    width: '80%',
    m: 0,
    mx: 'auto',
  },

  secret: {
    px: 8,
    py: 8,
    my: 4,
    whiteSpace: 'wrap',
    maxW: '900px',
    mx: 'auto',
  },

  title: {
    fontWeight: 700,
    fontSize: 'xl',
    lineHeight: 7,
    textAlign: { base: 'center', md: 'start' },
    mb: 3,
  },

  body: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: { base: 'center', md: 'start' },
    gap: 3,
    mb: 5,
    w: 'full',
    flexBasis: '33%',
    flexGrow: 0,
    flexShrink: 0,
    '& div': {
      flexBasis: '33%',
      display: 'flex',
      flexDirection: { base: 'column', md: 'row' },
      alignItems: { base: 'center', md: 'start' },
      w: 'full',
    },
  },

  progress: {
    w: 'full',
  },

  choiceTitle: {
    maxW: '100%',
    flexBasis: '33%',
    flexGrow: 1,
  },

  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
})

const ElectionResults = defineMultiStyleConfig({
  baseStyle,
})

export default ElectionResults
