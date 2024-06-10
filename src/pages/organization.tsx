import { Flex, Text, useBreakpointValue, VStack } from '@chakra-ui/react'
import {
  OrganizationDescription,
  OrganizationHeader,
  OrganizationImage,
  OrganizationName,
} from '@vocdoni/chakra-components'
import { OrganizationProvider } from '@vocdoni/react-providers'
import { AccountData } from '@vocdoni/sdk'
import { Trans } from 'react-i18next'
import { useLoaderData } from 'react-router-dom'
import { FallbackAccountImg, FallbackHeaderImg } from '~constants'
import { CopyButton, ReducedTextAndCopy } from '~components/CopyBtn'

const Organization = () => {
  const org = useLoaderData() as AccountData
  const isSmallScreen = useBreakpointValue({ base: true, sm: false })

  return (
    <Flex direction={'column'} mt={'40px'} gap={6}>
      <OrganizationProvider organization={org}>
        <OrganizationHeader fallbackSrc={FallbackHeaderImg} />
        <Flex gap={4} direction={'column'} align={'center'} mt={{ base: '-80px', md: '-100px' }}>
          <OrganizationImage
            objectFit='cover'
            maxW={{ base: '80px', md: '120px', lg: '140px' }}
            maxH={'140px'}
            fallbackSrc={FallbackAccountImg}
          />
          <VStack>
            <OrganizationName fontSize='4xl' />
            {isSmallScreen ? (
              <ReducedTextAndCopy
                color={'textAccent1'}
                toCopy={org.address}
                fontWeight={'normal'}
                h={0}
                fontSize={'md'}
              >
                {org.address}
              </ReducedTextAndCopy>
            ) : (
              <CopyButton toCopy={org.address} color={'textAccent1'} fontWeight={'normal'} h={0} fontSize={'md'}>
                {org.address}
              </CopyButton>
            )}
          </VStack>
        </Flex>
        <VStack align='start' gap={2}>
          <Text fontSize='xl' color={'blueText'}>
            <Trans i18nKey={'organization.description'}>Description</Trans>
          </Text>
          <OrganizationDescription />
        </VStack>
      </OrganizationProvider>
    </Flex>
  )
}

export default Organization
