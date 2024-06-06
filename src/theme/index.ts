import { extendTheme } from '@chakra-ui/react'
import { theme as vtheme } from '@vocdoni/chakra-components'
import { ElectionHeader, ElectionTitle } from './election'
import Questions from './questions'
import Radio from './radio'
import ElectionResults from './results'
import { colors } from '~src/theme/colors'
import { tagTheme } from '~src/theme/components/StatusBage'

const theme = extendTheme(vtheme, {
  components: {
    ElectionTitle,
    ElectionHeader,
    Questions,
    Radio,
    ElectionResults,
    Tag: tagTheme,
  },
  colors,
})

export default theme
