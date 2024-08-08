import { createMultiStyleConfigHelpers } from '@chakra-ui/react'
import { envelopeAnatomy } from '@vocdoni/chakra-components'

const { defineMultiStyleConfig, definePartsStyle } = createMultiStyleConfigHelpers(envelopeAnatomy)

const Envelope = defineMultiStyleConfig({
  baseStyle: definePartsStyle({
    title: {
      pb: 0,
      fontWeight: 'bold',
      fontSize: 'lg',
    },
    choiceTitle: {
      _before: {
        content: '"-"',
        pr: 1,
      },
    },
  }),
})

export default Envelope
