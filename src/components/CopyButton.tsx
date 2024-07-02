import { ButtonProps, IconButton, Tooltip, useClipboard } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { IoCheckmark, IoCopy } from 'react-icons/io5'
import { shortHex } from '~utils/strings'

type ICopyButton = ButtonProps & {
  toCopy: string
}

export const CopyButton = ({ toCopy, ...rest }: ICopyButton) => {
  const { t } = useTranslation()
  const { onCopy, setValue, hasCopied } = useClipboard(toCopy, { timeout: 1000 })
  const label = hasCopied
    ? t('copy.copied_to_clipboard', { defaultValue: 'Copied!' })
    : t('copy.copy_to_clipboard', { defaultValue: 'Copy to clipboard' })

  useEffect(() => {
    setValue(toCopy)
  }, [toCopy])

  return (
    <Tooltip label={label} aria-label={label} isOpen={hasCopied ? hasCopied : undefined} placement='top'>
      <IconButton
        variant={'text'}
        aria-label={label}
        onClick={() => onCopy()}
        icon={hasCopied ? <IoCheckmark /> : <IoCopy />}
        {...rest}
      />
    </Tooltip>
  )
}

export const ReducedTextAndCopy = ({ children, ...rest }: ICopyButton) => {
  let text = children
  if (typeof children === 'string' && children.length > 13) {
    text = shortHex(children)
  }
  return (
    <CopyButton fontWeight={'normal'} h={0} fontSize={'xs'} p={0} pt={1} {...rest}>
      {text}
    </CopyButton>
  )
}
