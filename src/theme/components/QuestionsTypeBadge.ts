import { createMultiStyleConfigHelpers } from '@chakra-ui/react'
import { questionTypeBadgeAnatomy } from '@vocdoni/chakra-components'
import { vocdoniStatusBadge } from '~src/theme/components/Tag'

const { defineMultiStyleConfig, definePartsStyle } = createMultiStyleConfigHelpers(questionTypeBadgeAnatomy)

const baseStyle = definePartsStyle({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    ...vocdoniStatusBadge.container,
    height: '24px',
  },
})

export const QuestionsTypeBadge = defineMultiStyleConfig({
  baseStyle,
})
