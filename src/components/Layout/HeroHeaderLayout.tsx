import { Flex } from '@chakra-ui/react'
import { OrganizationImage } from '@vocdoni/chakra-components'
import { PropsWithChildren, ReactNode } from 'react'
import { FallbackAccountImg } from '~constants'

/**
 * Layout used to create a Hero banner page with the logo of the organization
 * @param header - The header component, usually de ElectionHeader or the OrganizationHeader
 * @param children - The content of the page under the lofo of the organization
 */
export const HeroHeaderLayout = ({ header, children }: PropsWithChildren<{ header: ReactNode }>) => {
  return (
    <Flex direction={'column'} gap={6} mb={{ base: 7, md: 2 }}>
      {header}
      <Flex gap={4} direction={'column'} align={'center'} mt={{ base: '-80px', md: '-100px' }}>
        <OrganizationImage
          objectFit='cover'
          maxW={{ base: '80px', md: '120px', lg: '140px' }}
          maxH={'140px'}
          fallbackSrc={FallbackAccountImg}
        />
        {children}
      </Flex>
    </Flex>
  )
}
