import { Box, Flex, Icon, Text, useBreakpointValue, VStack } from '@chakra-ui/react'
import { OrganizationDescription, OrganizationHeader, OrganizationName } from '@vocdoni/chakra-components'
import { useOrganization } from '@vocdoni/react-providers'
import { AccountData, ensure0x, PublishedElection } from '@vocdoni/sdk'
import { Trans } from 'react-i18next'
import { FaUserAlt } from 'react-icons/fa'
import { CopyButton, ReducedTextAndCopy } from '~components/Layout/CopyButton'
import { HeroHeaderLayout } from '~components/Layout/HeroHeaderLayout'
import { LoadingCards } from '~components/Layout/Loading'
import ShowRawButton from '~components/Layout/ShowRawButton'
import { Pagination } from '~components/Pagination/Pagination'
import { PaginationProvider, usePagination } from '~components/Pagination/PaginationProvider'
import { ElectionCard } from '~components/Process/Card'
import { AppBaseURL, FallbackHeaderImg, PaginationItemsPerPage } from '~constants'
import { useOrganizationElections } from '~queries/organizations'

const OrganizationDetail = () => {
  const { organization: org } = useOrganization()

  // Should be already loaded
  if (!org) return null

  const id = org.address
  const isSmallScreen = useBreakpointValue({ base: true, sm: false })

  return (
    <>
      <HeroHeaderLayout header={<OrganizationHeader fallbackSrc={FallbackHeaderImg} />}>
        <VStack>
          <OrganizationName fontSize='4xl' wordBreak='break-word' />
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
      </HeroHeaderLayout>

      <Flex align='start' gap={2} direction={'column'}>
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
      <ShowRawButton obj={org} mt={4} />
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
    <PaginationProvider totalPages={Math.ceil(org.electionIndex / PaginationItemsPerPage)}>
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
        if (election instanceof PublishedElection) return <ElectionCard key={election.id} election={election} />
        return null
      })}
    </Flex>
  )
}

export default OrganizationDetail
