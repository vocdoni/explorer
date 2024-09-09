import { Box, Flex, Icon, IconProps, Link } from '@chakra-ui/react'
import { PropsWithChildren } from 'react'
import { IconType } from 'react-icons'
import { generatePath, Link as RouterLink } from 'react-router-dom'
import { RoutePath } from '~constants'
import { Icons } from '~src/theme/components/Icons'

export const TxIconLink = ({ block, index }: { block: number; index: number }) => (
  <IconLink
    icon={Icons.TxIcon}
    to={generatePath(RoutePath.Transaction, {
      block: block.toString(),
      index: index.toString(),
      tab: null,
    })}
  >
    {index}
  </IconLink>
)

export const BlockIconLink = ({ height }: { height: number }) => (
  <IconLink
    icon={Icons.BlockIcon}
    to={generatePath(RoutePath.Block, {
      height: height.toString(),
      page: null,
      tab: null,
    })}
  >
    {height}
  </IconLink>
)

type IconLinkProps = {
  to: string
  icon: IconType
} & IconProps

export const IconLink = ({ to, icon, children, ...iconProps }: IconLinkProps & PropsWithChildren) => {
  return (
    <Link as={RouterLink} to={to}>
      <Flex align='center' gap={2}>
        <Icon as={icon} {...iconProps} />
        <Box>{children}</Box>
      </Flex>
    </Link>
  )
}
