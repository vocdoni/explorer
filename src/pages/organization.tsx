import { Flex, Text, useBreakpointValue, VStack } from '@chakra-ui/react'
import {
  OrganizationDescription,
  OrganizationHeader,
  OrganizationImage,
  OrganizationName,
} from '@vocdoni/chakra-components'
import { OrganizationProvider } from '@vocdoni/react-providers'
import { AccountData, ensure0x } from '@vocdoni/sdk'
import { Trans } from 'react-i18next'
import { useLoaderData } from 'react-router-dom'
import { AppBaseURL, FallbackAccountImg, FallbackHeaderImg } from '~constants'
import { CopyButton, ReducedTextAndCopy } from '~components/CopyBtn'

const Organization = () => {
  const org = useLoaderData() as AccountData

  const id = org.address
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
              <ReducedTextAndCopy color={'textAccent1'} toCopy={id} fontWeight={'normal'} h={0} fontSize={'md'}>
                {id}
              </ReducedTextAndCopy>
            ) : (
              <CopyButton toCopy={id} color={'textAccent1'} fontWeight={'normal'} h={0} fontSize={'md'}>
                {id}
              </CopyButton>
            )}
          </VStack>
        </Flex>
        <VStack align='start' gap={2}>
          {org.account.description.default && (
            <>
              <Text fontSize='xl' color={'blueText'}>
                <Trans i18nKey={'organization.description'}>Description</Trans>
              </Text>
              <OrganizationDescription />
            </>
          )}
          <Text
            as={'a'}
            target='blank'
            href={`${AppBaseURL}/organization/${ensure0x(id)}`}
            fontSize='xl'
            color={'blueText'}
          >
            <Trans i18nKey={'organization.view_profile'}>(View profile)</Trans>
          </Text>
        </VStack>
      </OrganizationProvider>
    </Flex>
  )
}

export default Organization
