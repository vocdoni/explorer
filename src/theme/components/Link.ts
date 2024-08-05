import { defineStyle, defineStyleConfig } from '@chakra-ui/react'

const baseStyle = defineStyle({
  color: 'link',
  textDecoration: 'none',
  transition: 'all .2s',
  _hover: {
    textDecoration: 'none',
    color: 'accent1',
  },
})

const Link = defineStyleConfig({
  baseStyle,
})

export default Link
