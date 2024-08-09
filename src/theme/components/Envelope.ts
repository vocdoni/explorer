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
      listStyle: 'disc',
      ml: 4,
    },
  }),
})

export default Envelope
