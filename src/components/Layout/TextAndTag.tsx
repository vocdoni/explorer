import { Box, HStack, Tag } from '@chakra-ui/react'
import { TagProps } from '@chakra-ui/tag/dist/tag'

const TextAndTag = ({ text, tagLabel, ...rest }: { text: string; tagLabel: string } & TagProps) => {
  return (
    <HStack spacing={2}>
      <Box>{text}</Box>
      <Tag borderRadius='full' colorScheme='green' {...rest}>
        {tagLabel}
      </Tag>
    </HStack>
  )
}

export default TextAndTag
