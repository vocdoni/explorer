import { Box, Flex, Icon, Text, useBreakpointValue, VStack } from '@chakra-ui/react'
import { OrganizationDescription, OrganizationHeader, OrganizationName } from '@vocdoni/chakra-components'
import { useOrganization } from '@vocdoni/react-providers'
import { AccountData, ensure0x, PublishedElection } from '@vocdoni/sdk'
import { Trans } from 'react-i18next'
import { FaUserAlt } from 'react-icons/fa'
import { useParams } from 'react-router-dom'
import { CopyButton, ReducedTextAndCopy } from '~components/Layout/CopyButton'
import { HeroHeaderLayout } from '~components/Layout/HeroHeaderLayout'
import { LoadingCards } from '~components/Layout/Loading'
import ShowRawButton from '~components/Layout/ShowRawButton'
import { RoutedPagination } from '~components/Pagination/Pagination'
import { RoutedPaginationProvider } from '~components/Pagination/PaginationProvider'
import { ElectionCard } from '~components/Process/Card'
import { AppBaseURL, FallbackHeaderImg, PaginationItemsPerPage, RoutePath } from '~constants'
import { useOrganizationElections } from '~queries/organizations'
import { retryUnlessNotFound } from '~utils/queries'

const OrganizationDetail = () => {
  const { organization } = useOrganization()

  // Should be already loaded
  if (!organization) return null

  const id = organization.address
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
        {organization.account.description.default && (
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
      <OrganizationElections org={organization} />
      <ShowRawButton obj={organization} mt={4} />
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
    <RoutedPaginationProvider
      totalPages={Math.ceil(org.electionIndex / PaginationItemsPerPage)}
      path={RoutePath.Organization}
    >
      <Flex direction={'column'} gap={4}>
        <OrganizationElectionsList org={org} />
        <RoutedPagination />
      </Flex>
    </RoutedPaginationProvider>
  )
}

const OrganizationElectionsList = ({ org }: { org: AccountData }) => {
  const { page } = useParams()

  const { data: elections, isLoading } = useOrganizationElections({
    address: org.address,
    page: Number(page) - 1 || 0,
    options: {
      enabled: !!org.address,
      retry: retryUnlessNotFound,
    },
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
