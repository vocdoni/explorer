import { extendTheme } from '@chakra-ui/react'
import { theme as vtheme } from '@vocdoni/chakra-components'
import { colors } from './colors'
import components from './components'

const theme = extendTheme(vtheme, {
  components,
  colors,
  styles: {
    global: {
      ':root': { '--box-shadow-darker': '0px 2px 4px #808080b5' },
    },
  },
})

export default theme
