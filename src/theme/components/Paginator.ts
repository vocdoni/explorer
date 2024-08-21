import { createMultiStyleConfigHelpers } from '@chakra-ui/react'
import { PaginationAnatomy } from '@vocdoni/chakra-components'

const { defineMultiStyleConfig, definePartsStyle } = createMultiStyleConfigHelpers(PaginationAnatomy)

const Pagination = defineMultiStyleConfig({
  baseStyle: definePartsStyle({
    buttonGroup: {
      flexWrap: 'wrap',
      rowGap: '2',
    },
    totalResults: {
      pt: 2,
      color: 'lighterText',
    },
  }),
})

export default Pagination
