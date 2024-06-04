import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, ButtonProps, Tooltip, useClipboard, useToast } from '@chakra-ui/react'
import { IoCopy } from 'react-icons/io5'

type ICopyButton = ButtonProps & {
  toCopy: string
}

export const CopyButton = ({ toCopy, ...rest }: ICopyButton) => {
  const { t } = useTranslation()
  const toast = useToast()
  const { onCopy, value, setValue } = useClipboard('')

  const handleCopy = () => {
    onCopy()
    toast({
      title: t('copy.copied_to_the_clipboard'),
      status: 'success',
      duration: 2000,
      isClosable: true,
    })
  }

  useEffect(() => {
    setValue(toCopy)
  }, [toCopy])

  return (
    <Tooltip label={t('copy.copy_to_clipboard')} aria-label='Copy to clipboard'>
      <Button variant={'text'} onClick={handleCopy} rightIcon={<IoCopy />} {...rest} />
    </Tooltip>
  )
}

export const ReducedTextAndCopy = ({ children, ...rest }: ICopyButton) => {
  let text = children
  if (typeof children === 'string') {
    text =
      children.length < 13
        ? children
        : children.substring(0, 5) + '...' + children.substring(children.length - 4, children.length)
  }
  return (
    <CopyButton fontWeight={'normal'} h={0} fontSize={'xs'} p={0} pt={1} {...rest}>
      {text}
    </CopyButton>
  )
}