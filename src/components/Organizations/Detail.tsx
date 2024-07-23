import {
  Box,
  Flex,
  Icon,
  IconProps,
  Link,
  Tab,
  Table,
  TableContainer,
  TabList,
  TabPanel,
  TabPanels,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  VStack,
} from '@chakra-ui/react'
import { OrganizationDescription, OrganizationHeader, OrganizationName } from '@vocdoni/chakra-components'
import { useOrganization } from '@vocdoni/react-providers'
import { AccountData, ensure0x, PublishedElection } from '@vocdoni/sdk'
import { Trans, useTranslation } from 'react-i18next'
import { FaUserAlt } from 'react-icons/fa'
import { generatePath, Link as RouterLink, useParams } from 'react-router-dom'
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
import { useAccountTransfers, useAccountTransfersCount, useOrganizationElections } from '~queries/organizations'
import { retryUnlessNotFound } from '~utils/queries'
import { useDateFns } from '~i18n/use-date-fns'
import { BiLogInCircle, BiLogOutCircle } from 'react-icons/bi'

const OrganizationDetail = () => {
  const { organization } = useOrganization()
  const { data } = useAccountTransfersCount({
    address: organization?.address || '',
  })

  // Should be already loaded
  if (!organization) return null

  const id = organization.address
  const transfersCount = data?.count

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
            <Trans i18nKey={'organization.elections_count'} count={organization.electionIndex}>
              Elections {{ count: organization.electionIndex }}
            </Trans>
          </Tab>
          <Tab>
            <Trans i18nKey={'organization.transfers_count'} count={transfersCount}>
              Transfers {{ count: transfersCount }}
            </Trans>
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
            <AccountTransfers org={organization} txCount={transfersCount} />
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

const FromToIcon = ({ isIncoming, ...rest }: { isIncoming: boolean } & IconProps) => {
  const { t } = useTranslation()

  let icon = BiLogOutCircle
  let color = 'textAccent2B'
  let tooltip = t('organization.transfers.outgoing_tx', { defaultValue: 'Outgoing tx' })
  if (isIncoming) {
    icon = BiLogInCircle
    color = 'accent1C'
    tooltip = t('organization.transfers.incoming_tx', { defaultValue: 'Incoming tx' })
  }

  return (
    <Tooltip label={tooltip}>
      <span>
        <Icon as={icon} color={color} {...rest} />
      </span>
    </Tooltip>
  )
}

const AccountTransfers = ({ txCount, org }: { txCount: number | undefined } & OrgComponentProps) => {
  const { page } = useParams()
  const { formatDistance } = useDateFns()

  const { data, isLoading } = useAccountTransfers({
    address: org.address,
    page: Number(page) - 1 || 0,
    options: {
      enabled: !!txCount && txCount > 0,
      retry: retryUnlessNotFound,
    },
  })

  if (txCount && !(txCount > 0)) {
    return (
      <Text>
        <Trans i18nKey={'organization.transfers.no_transfers'}>No transfers yet!</Trans>
      </Text>
    )
  }

  if (!txCount || isLoading) {
    return <LoadingCards />
  }

  let mergedTransfers = []
  if (data) {
    mergedTransfers = [...data.transfers.received, ...data.transfers.sent]
    mergedTransfers.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    // Todo: put this out of the when https://github.com/vocdoni/vocdoni-sdk/pull/400 is merged
    // Now is inside the if to infer the type properly
    return (
      <Box overflow='auto' w='auto'>
        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th>
                  <Trans i18nKey={'organization.transfers.tx_hash'}>Tx Hash</Trans>
                </Th>
                <Th>
                  <Trans i18nKey={'organization.transfers.block'}>Block</Trans>
                </Th>
                <Th>
                  <Trans i18nKey={'organization.transfers.from_to'}>From/To</Trans>
                </Th>
                <Th>
                  <Trans i18nKey={'organization.transfers.amount'}>Amount</Trans>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {mergedTransfers.map((transfer) => {
                const isIncoming = transfer.to === org.address
                let fromToAddress = isIncoming ? transfer.from : transfer.to
                return (
                  <Tr>
                    <Td>
                      <Flex direction={'column'} align={'start'} gap={3}>
                        <ReducedTextAndCopy
                          breakPoint={{ base: true }}
                          color={'textAccent1'}
                          toCopy={transfer.txHash}
                          fontWeight={'normal'}
                          fontSize={'sm'}
                          // todo: implement go to tx by its hash
                        >
                          {transfer.txHash}
                        </ReducedTextAndCopy>

                        <Text fontWeight={100} color={'lighterText'} fontSize={'sm'}>
                          {formatDistance(new Date(transfer.timestamp), new Date())}
                        </Text>
                      </Flex>
                    </Td>
                    <Td>
                      <Link
                        as={RouterLink}
                        to={generatePath(RoutePath.Block, { height: transfer.height.toString(), page: null })}
                      >
                        {transfer.height}
                      </Link>
                    </Td>
                    <Td>
                      <Flex align={'center'} gap={1}>
                        <Box>
                          <FromToIcon isIncoming={isIncoming} boxSize={5} />
                        </Box>
                        <ReducedTextAndCopy
                          breakPoint={{ base: true }}
                          color={'textAccent1'}
                          toCopy={fromToAddress}
                          fontWeight={'normal'}
                          fontSize={'md'}
                          p={1}
                          h={8}
                          to={generatePath(RoutePath.Organization, { pid: fromToAddress, page: null })}
                        >
                          {fromToAddress}
                        </ReducedTextAndCopy>
                      </Flex>
                    </Td>
                    <Td>{transfer.amount}</Td>
                  </Tr>
                )
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    )
  }
  // Todo: put this out of the when https://github.com/vocdoni/vocdoni-sdk/pull/400 is merged
  return <></>
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
