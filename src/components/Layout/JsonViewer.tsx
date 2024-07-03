import { Box, Text, VStack } from '@chakra-ui/react'

interface JsonViewerProps {
  json: object
  space?: number
}

export const JsonViewer: React.FC<JsonViewerProps> = ({ json, space = 2 }) => {
  const renderHighlightedJson = (json: string) => {
    const regex =
      /("(?:\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(?:\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g
    return json.split('\n').map((line, index) => (
      <Text key={index} fontFamily='monospace' whiteSpace='preserve' wordBreak='break-all'>
        {line.split(regex).map((part, index) => {
          let color = 'black'
          if (/^"/.test(part)) {
            if (/:$/.test(part)) {
              color = 'gray.600'
            } else {
              color = 'green.500'
            }
          } else if (/true|false/.test(part)) {
            color = 'blue.500'
          } else if (/null/.test(part)) {
            color = 'purple.500'
          } else if (/\b\d+\b/.test(part)) {
            color = 'red.300'
          }
          return (
            <Box as='span' color={color} key={index} overflowWrap='anywhere'>
              {part}
            </Box>
          )
        })}
      </Text>
    ))
  }

  const prettifiedJson = JSON.stringify(json, null, space)

  return (
    <VStack align='start'>
      <Box as='pre' p={4} overflow='auto' w='auto'>
        {renderHighlightedJson(prettifiedJson)}
      </Box>
    </VStack>
  )
}
