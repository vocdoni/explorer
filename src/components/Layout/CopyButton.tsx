import { Button, ButtonProps, Flex, IconButton, Tooltip, useBreakpointValue, useClipboard } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { IoCheckmark, IoCopy } from 'react-icons/io5'
import { shortHex } from '~utils/strings'
import { Link as RouterLink } from 'react-router-dom'

type ICopyButton = ButtonProps & {
  toCopy: string
}

const withCopyLogic = (Component: typeof IconButton | typeof Button) => {
  return ({ toCopy, ...rest }: ICopyButton) => {
    const { t } = useTranslation()
    const { onCopy, setValue, hasCopied } = useClipboard(toCopy, { timeout: 1000 })
    const label = hasCopied
      ? t('copy.copied_to_clipboard', { defaultValue: 'Copied!' })
      : t('copy.copy_to_clipboard', { defaultValue: 'Copy to clipboard' })

    useEffect(() => {
      setValue(toCopy)
    }, [toCopy, setValue])

    const icon = hasCopied ? <IoCheckmark /> : <IoCopy />

    return (
      <Tooltip label={label} aria-label={label} isOpen={hasCopied ? hasCopied : undefined} placement='top'>
        <Component
          variant={'text'}
          aria-label={label}
          onClick={(e) => {
            e.preventDefault()
            onCopy()
          }}
          {...(Component === Button ? { rightIcon: icon } : { icon })}
          {...rest}
        />
      </Tooltip>
    )
  }
}

export const CopyButton = withCopyLogic(Button)
export const CopyButtonIcon = withCopyLogic(IconButton)

/**
 * It shows a text with a copy button. If not breakpoint is defined it uses default one: { base: true, sm: false },
 * @param reduced If it wants to be shown reduced independently of div size (for max length of 13)
 * @param breakPoint If it wants to be shown reduced on a specific breakpoint. If null it will show the entire text
 * @param to if defined, the part of the text will be rendered as a link
 * @param children The text to be shown
 */
export const ReducedTextAndCopy = ({
  reduced = false,
  breakPoint = { base: true, sm: false },
  to,
  children = '',
  ...rest
}: {
  reduced?: boolean
  to?: string
  breakPoint?: Parameters<typeof useBreakpointValue>[0]
  children?: string
} & ICopyButton) => {
  let text = children
  // If it wants to be shown reduced or is small screen via the breakpoint
  if ((reduced && children.length > 13) || (breakPoint && useBreakpointValue(breakPoint))) {
    text = shortHex(children)
  }

  if (to) {
    return (
      <Flex>
        <Button as={RouterLink} to={to} variant={'text'} aria-label={children} {...rest}>
          {text}
        </Button>
        <CopyButton {...rest} m={0} />
      </Flex>
    )
  }
  return (
    <CopyButton fontWeight={'normal'} h={0} fontSize={'xs'} p={0} pt={1} {...rest}>
      {text}
    </CopyButton>
  )
}
