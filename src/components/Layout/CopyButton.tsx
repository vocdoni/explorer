import { Button, ButtonProps, IconButton, Link, Tooltip, useBreakpointValue, useClipboard } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { IoCheckmark, IoCopy } from 'react-icons/io5'
import { Link as RouterLink } from 'react-router-dom'
import { shortStr } from '~utils/strings'

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

export type ReducedTextAndCopyProps = {
  breakPoint?: Parameters<typeof useBreakpointValue>[0]
  to?: string
  children?: string
} & ICopyButton

/**
 * It shows a text with a copy button.
 * if the length of the string is more than 13 it cut the string to something like 6be21a...0000.
 * If not breakpoint is defined it uses default one: { base: true, sm: false },
 * @param breakPoint If it wants to be shown reduced on a specific breakpoint. If null it will show the entire text
 * @param to if defined, the part of the text will be rendered as a link
 * @param children The text to be shown
 */
export const ReducedTextAndCopy = ({
  breakPoint = { base: true, sm: false },
  to,
  children = '',
  ...rest
}: ReducedTextAndCopyProps) => {
  let text = children
  // If breakpoint is true and the length of the string is more than 13 it shorts the string
  if (breakPoint && useBreakpointValue(breakPoint) && children.length > 13) {
    text = shortStr(children)
  }

  if (to) {
    return (
      <>
        <Link
          as={RouterLink}
          to={to}
          variant={'text'}
          aria-label={children}
          h={6} // Fixes the alignment caused to combine buttons with text
          mr={0}
          pr={0}
        >
          {text}
        </Link>
        <CopyButtonIcon h={6} {...rest} justifyContent={'start'} ml={2} pl={0} />
      </>
    )
  }
  return (
    <CopyButton fontWeight={'normal'} h={0} fontSize={'xs'} p={0} pt={1} {...rest}>
      {text}
    </CopyButton>
  )
}
