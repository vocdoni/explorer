import { Card, CardProps, LinkBox, LinkOverlay } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

const LinkCard = ({ to, ...rest }: { to: string } & CardProps) => {
  return (
    <LinkBox w={'full'} h={'full'}>
      <LinkOverlay as={RouterLink} to={to}>
        <Card {...rest} variant={'link'} />
      </LinkOverlay>
    </LinkBox>
  )
}

export default LinkCard
