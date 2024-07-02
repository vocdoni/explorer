import { defineStyle, defineStyleConfig } from '@chakra-ui/react'

const baseStyle = defineStyle({
  _hover: {
    textDecoration: 'none',
    color: 'link',
  },
})

export const Link = defineStyleConfig({
  baseStyle,
})
