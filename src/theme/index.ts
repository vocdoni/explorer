import { extendTheme } from '@chakra-ui/react'
import { theme as vtheme } from '@vocdoni/chakra-components'
import { colors } from './colors'
import components from './components'

const theme = extendTheme(vtheme, {
  components,
  colors,
})

export default theme
