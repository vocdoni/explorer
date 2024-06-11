import { Box, Flex, Icon, Text, useBreakpointValue, VStack } from '@chakra-ui/react'
import {
  OrganizationDescription,
  OrganizationHeader,
  OrganizationImage,
  OrganizationName,
} from '@vocdoni/chakra-components'
import { useOrganization } from '@vocdoni/react-providers'
import { Trans } from 'react-i18next'
import { AppBaseURL, FallbackAccountImg, FallbackHeaderImg } from '~constants'
import { CopyButton, ReducedTextAndCopy } from '~components/CopyBtn'
import { FaUserAlt } from 'react-icons/fa'
import { AccountData, ensure0x, PublishedElection } from '@vocdoni/sdk'
import { useOrganizationElections } from '~queries/organizations'
import { LoadingCards } from '~src/layout/Loading'
import { PaginationProvider, usePagination } from '~components/Pagination/PaginationProvider'
import { Pagination } from '~components/Pagination/Pagination'
import ElectionCard from '~components/Process/Card'

const OrganizationDetail = () => {
  const { organization: org } = useOrganization()

  // Should be already loaded
  if (!org) return null

  const id = org.address
  const isSmallScreen = useBreakpointValue({ base: true, sm: false })

  return (
    <>
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
          <Flex
            as={'a'}
            target='blank'
            href={`${AppBaseURL}/organization/${ensure0x(id)}`}
            pt={4}
            align={'end'}
            gap={3}
            color={'blueText'}
          >
            <Box>
              <Icon as={FaUserAlt} boxSize={5} />
            </Box>
            <Box>
              <Text fontSize='xl' verticalAlign='bottom'>
                <Trans i18nKey={'organization.view_profile'}>(View profile)</Trans>
              </Text>
            </Box>
          </Flex>
        </VStack>
      </Flex>
      <Flex align='start' gap={2}>
        {org.account.description.default && (
          <>
            <Text fontSize='xl' color={'blueText'}>
              <Trans i18nKey={'organization.description'}>Description</Trans>
            </Text>
            <OrganizationDescription />
          </>
        )}
      </Flex>
      <Text fontSize='xl' color={'blueText'}>
        <Trans i18nKey={'organization.elections_list'}>Elections List:</Trans>
      </Text>
      <OrganizationElections org={org} />
    </>
  )
}

const OrganizationElections = ({ org }: { org: AccountData }) => {
  if (org.electionIndex === 0) {
    return (
      <Text>
        <Trans i18nKey={'organization.no_elections'}>No elections yet!</Trans>
      </Text>
    )
  }

  return (
    <PaginationProvider totalPages={Math.ceil(org.electionIndex / 10)}>
      <Flex direction={'column'} gap={4}>
        <OrganizationElectionsList org={org} />
        <Pagination />
      </Flex>
    </PaginationProvider>
  )
}

const OrganizationElectionsList = ({ org }: { org: AccountData }) => {
  const { page } = usePagination()

  const { data: elections, isLoading } = useOrganizationElections({
    address: org.address,
    page,
    options: { enabled: !!org.address },
  })

  if (isLoading) {
    return <LoadingCards />
  }

  return (
    <Flex direction={'column'} gap={4}>
      {elections?.map((election) => {
        if (election instanceof PublishedElection) return <ElectionCard election={election} />
        return null
      })}
    </Flex>
  )
}

export default OrganizationDetail
