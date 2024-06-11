import { Box, Button, ButtonProps, Code } from '@chakra-ui/react'
import { useCallback, useState } from 'react'
import { Trans } from 'react-i18next'

const ShowRawButton = ({ obj, ...props }: { obj: object } & Omit<ButtonProps, 'onClick'>) => {
  const [showRaw, setShowRaw] = useState(false)

  const toggleRaw = useCallback(() => {
    setShowRaw(!showRaw)
  }, [showRaw])
  return (
    <>
      <Button onClick={toggleRaw} {...props}>
        <Trans i18nKey={'raw_content'}>Raw content</Trans>
      </Button>
      {showRaw && (
        <Box wordBreak='break-all' whiteSpace='pre' color='white' borderRadius='md' maxW={'90vw'}>
          <Code w={'full'} wordBreak='break-all' p='4' fontFamily='monospace' overflowX='auto'>
            {JSON.stringify(obj, null, 2)}
          </Code>
        </Box>
      )}
    </>
  )
}

export default ShowRawButton
