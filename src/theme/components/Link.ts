import { defineStyle, defineStyleConfig } from '@chakra-ui/react'

const baseStyle = defineStyle({
  _hover: {
    textDecoration: 'none',
    color: 'link',
  },
})

const Link = defineStyleConfig({
  baseStyle,
})

export default Link
