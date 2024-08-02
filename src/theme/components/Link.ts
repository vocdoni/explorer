import { defineStyle, defineStyleConfig } from '@chakra-ui/react'

const baseStyle = defineStyle({
  color: 'link',
  // textDecoration: 'underline',
  textDecoration: 'none',
  _hover: {
    textDecoration: 'none',
    color: 'accent1',
  },
})

const Link = defineStyleConfig({
  baseStyle,
})

export default Link
