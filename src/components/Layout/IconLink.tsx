import { Flex, Icon, IconProps, Link } from '@chakra-ui/react'
import { generatePath, Link as RouterLink } from 'react-router-dom'
import { PropsWithChildren } from 'react'
import { RoutePath } from '~constants'
import { HiOutlineCube } from 'react-icons/hi2'
import { IconType } from 'react-icons'

export const BlockIconLink = ({ height }: { height: number }) => (
  <IconLink
    icon={HiOutlineCube}
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
        <span>{children}</span>
      </Flex>
    </Link>
  )
}
