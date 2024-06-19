import { Box, BoxProps, Button, ButtonProps, Code, useDisclosure } from '@chakra-ui/react'
import { Trans } from 'react-i18next'

const ShowRawButton = ({ obj, ...props }: { obj: object } & Omit<ButtonProps, 'onClick'>) => {
  const { getDisclosureProps, getButtonProps } = useDisclosure()
  const buttonProps = getButtonProps()
  const disclosureProps = getDisclosureProps()

  return (
    <>
      <Button {...buttonProps} {...props}>
        <Trans i18nKey={'raw_content'}>Raw content</Trans>
      </Button>
      <Box {...disclosureProps}>
        <RawContentBox obj={obj} />
      </Box>
    </>
  )
}

export const RawContentBox = ({ obj, ...rest }: { obj: object } & BoxProps) => (
  <Box wordBreak='break-all' whiteSpace='pre' color='white' borderRadius='md' maxW={'90vw'} {...rest}>
    <Code w={'full'} wordBreak='break-all' p='4' fontFamily='monospace' overflowX='auto'>
      {JSON.stringify(obj, null, 2)}
    </Code>
  </Box>
)

export default ShowRawButton
