import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { IoCopy } from 'react-icons/io5'
import { Box, Flex, Icon, Tooltip, useClipboard, useToast } from '@chakra-ui/react'

interface ICopyButton {
  toCopy: string
  text: string
  size?: string
  color?: string
}

export const CopyButton = ({ toCopy, text, size, color = 'inherit' }: ICopyButton) => {
  const { t } = useTranslation()
  const toast = useToast()
  const { onCopy, value, setValue } = useClipboard('')

  const handleCopy = (e: any) => {
    e.cancelBubble = true
    e.stopPropagation()
    e.preventDefault()
    e.target.focus()
    onCopy()
    toast({
      title: t('copy.copied_to_the_clipboard'),
      status: 'success',
      duration: 4000,
      isClosable: true,
    })
  }

  useEffect(() => {
    setValue(toCopy)
  }, [toCopy])

  return (
    <Box onClick={handleCopy} style={{ width: 'fit-content' }}>
      <Flex align='center' color={color} gap={1} justify={'end'}>
        {text}
        <Tooltip label={t('copy.copy_to_clipboard')} aria-label='Copy to clipboard'>
          <Box as='span'>
            <Icon as={IoCopy} w={size} h={size} css={{ cursor: 'pointer' }} />
          </Box>
        </Tooltip>
      </Flex>
    </Box>
  )
}

export const ReducedTextAndCopy = ({ text, ...rest }: ICopyButton) => {
  const entityTxt =
    text.length < 13 ? text : text.substring(0, 5) + '...' + text.substring(text.length - 4, text.length)
  return <CopyButton text={entityTxt} {...rest} />
}
