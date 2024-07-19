import { Box, Flex, Icon, Tab, TabList, TabPanel, TabPanels, Text, VStack } from '@chakra-ui/react'
import { OrganizationDescription, OrganizationHeader, OrganizationName } from '@vocdoni/chakra-components'
import { useOrganization } from '@vocdoni/react-providers'
import { AccountData, ensure0x, PublishedElection } from '@vocdoni/sdk'
import { Trans, useTranslation } from 'react-i18next'
import { FaUserAlt } from 'react-icons/fa'
import { useParams } from 'react-router-dom'
import { ReducedTextAndCopy } from '~components/Layout/CopyButton'
import { DetailsGrid, GridItemProps } from '~components/Layout/DetailsGrid'
import { HeroHeaderLayout } from '~components/Layout/HeroHeaderLayout'
import { LoadingCards } from '~components/Layout/Loading'
import { QueryParamsTabs } from '~components/Layout/QueryParamsTabs'
import { RawContentBox } from '~components/Layout/ShowRawButton'
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

  return (
    <>
      <HeroHeaderLayout header={<OrganizationHeader fallbackSrc={FallbackHeaderImg} />}>
        <VStack>
          <OrganizationName fontSize='4xl' wordBreak='break-word' textAlign={'center'} />
          <ReducedTextAndCopy color={'textAccent1'} toCopy={id} fontWeight={'normal'} h={0} fontSize={'md'}>
            {id}
          </ReducedTextAndCopy>
        </VStack>
      </HeroHeaderLayout>
      <QueryParamsTabs isLazy>
        <TabList display='flex' flexWrap='wrap'>
          <Tab>
            <Trans i18nKey={'process.tab_details'}>Details</Trans>
          </Tab>
          <Tab>
            <Trans i18nKey={'organization.elections_list'}>Elections</Trans>
          </Tab>
          <Tab>
            <Trans i18nKey={'raw'}>Raw</Trans>
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <OrgDetails org={organization} />
          </TabPanel>
          <TabPanel>
            <OrganizationElections org={organization} />
          </TabPanel>
          <TabPanel>
            <RawContentBox obj={organization} />
          </TabPanel>
        </TabPanels>
      </QueryParamsTabs>
    </>
  )
}

interface OrgComponentProps {
  org: AccountData
}

const OrganizationElections = ({ org }: OrgComponentProps) => {
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

const OrganizationElectionsList = ({ org }: OrgComponentProps) => {
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

const OrgDetails = ({ org }: OrgComponentProps) => {
  const { t } = useTranslation()

  const details: GridItemProps[] = [
    {
      label: t('organization.nonce', { defaultValue: 'Nonce' }),
      children: org.nonce,
    },
    {
      label: t('organization.balance', { defaultValue: 'Balance' }),
      children: org.balance,
    },
    {
      label: t('organization.election_count', { defaultValue: 'Elections' }),
      children: org.electionIndex,
    },
    {
      label: t('organization.profile', { defaultValue: 'Profile' }),
      children: (
        <Flex
          as={'a'}
          target='blank'
          href={`${AppBaseURL}/organization/${ensure0x(org.address)}`}
          align={'end'}
          gap={3}
          color={'blueText'}
        >
          <Box>
            <Icon as={FaUserAlt} boxSize={3} />
          </Box>
          <Box>
            <Text verticalAlign='bottom'>
              <Trans i18nKey={'organization.view_profile'}></Trans>
            </Text>
          </Box>
        </Flex>
      ),
    },
    ...(org.account.description.default
      ? [
          {
            label: t('organization.description', { defaultValue: 'Description' }),
            children: <OrganizationDescription />,
          },
        ]
      : []),
  ]
  return (
    <Flex align='start' gap={2} direction={'column'}>
      <DetailsGrid details={details} />
    </Flex>
  )
}

export default OrganizationDetail
