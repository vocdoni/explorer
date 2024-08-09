// Based from https://github.com/blockscout/frontend/blob/main/ui/shared/Hint.tsx
import type { TooltipProps } from '@chakra-ui/react'
import { chakra, IconButton, Skeleton, Tooltip, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { GrStatusInfo } from 'react-icons/gr'

interface Props {
  label: string | React.ReactNode
  className?: string
  tooltipProps?: Partial<TooltipProps>
  isLoading?: boolean
}

const Hint = ({ label, className, tooltipProps, isLoading }: Props) => {
  // have to implement controlled tooltip because of the issue - https://github.com/chakra-ui/chakra-ui/issues/7107
  const { isOpen, onOpen, onToggle, onClose } = useDisclosure()

  const handleClick = React.useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation()
      onToggle()
    },
    [onToggle]
  )

  if (isLoading) {
    return <Skeleton className={className} boxSize={5} borderRadius='sm' />
  }

  return (
    <Tooltip
      label={label}
      placement='top'
      maxW={{ base: 'calc(100vw - 8px)', lg: '320px' }}
      isOpen={isOpen}
      {...tooltipProps}
    >
      <IconButton
        minW={2}
        colorScheme='none'
        aria-label='hint'
        icon={<GrStatusInfo />}
        boxSize={5}
        variant='simple'
        display='inline-block'
        flexShrink={0}
        className={className}
        onMouseEnter={onOpen}
        onMouseLeave={onClose}
        onClick={handleClick}
      />
    </Tooltip>
  )
}

export default React.memo(chakra(Hint))
