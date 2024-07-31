import {
  Box,
  BoxProps,
  Button,
  ButtonProps,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  TextProps,
  useDisclosure,
} from '@chakra-ui/react'
import { Trans } from 'react-i18next'
import { CopyButtonIcon } from '~components/Layout/CopyButton'
import { JsonViewer } from '~components/Layout/JsonViewer'

const ShowRawButton = ({ obj, ...props }: { obj: object } & Omit<ButtonProps, 'onClick'>) => {
  const { getDisclosureProps, getButtonProps } = useDisclosure()
  const buttonProps = getButtonProps()
  const disclosureProps = getDisclosureProps()

  return (
    <>
      <Button {...buttonProps} {...props}>
        <Trans i18nKey={'raw'}>Raw</Trans>
      </Button>
      <Box mt={2} {...disclosureProps}>
        <RawContentBox obj={obj} />
      </Box>
    </>
  )
}

export const RawContentBox = ({ obj, ...rest }: { obj: object } & BoxProps) => (
  <Box borderRadius='md' backgroundColor='gray.50' position='relative' {...rest}>
    <CopyButtonIcon toCopy={JSON.stringify(obj, null, 2)} pos='absolute' top={2} right={2} variant='solid' />
    <JsonViewer json={obj} />
  </Box>
)

export const RawModal = ({ obj, ...rest }: { obj: object } & TextProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Text onClick={onOpen} {...rest}>
        <Trans i18nKey={'raw'} />
      </Text>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Trans i18nKey={'raw'}></Trans>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <RawContentBox obj={obj} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ShowRawButton
