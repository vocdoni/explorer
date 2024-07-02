import { Box, BoxProps, Button, ButtonProps, useDisclosure } from '@chakra-ui/react'
import { Trans } from 'react-i18next'
import { CopyButton } from '~components/CopyButton'
import { JsonViewer } from './JsonViewer'

const ShowRawButton = ({ obj, ...props }: { obj: object } & Omit<ButtonProps, 'onClick'>) => {
  const { getDisclosureProps, getButtonProps } = useDisclosure()
  const buttonProps = getButtonProps()
  const disclosureProps = getDisclosureProps()

  return (
    <>
      <Button {...buttonProps} {...props}>
        <Trans i18nKey={'raw_content'}>Raw content</Trans>
      </Button>
      <Box {...disclosureProps} position='relative'>
        <CopyButton toCopy={JSON.stringify(obj, null, 2)} pos='absolute' top={2} right={2} variant='solid' />
        <RawContentBox obj={obj} />
      </Box>
    </>
  )
}

export const RawContentBox = ({ obj, ...rest }: { obj: object } & BoxProps) => (
  <Box borderRadius='md' backgroundColor='gray.50' {...rest}>
    <JsonViewer json={obj} />
  </Box>
)

export default ShowRawButton
