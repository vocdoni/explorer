import {
  Alert,
  AlertIcon,
  Box,
  Card,
  CardBody,
  CardHeader,
  CardProps,
  Flex,
  Grid,
  GridItem,
  Icon,
  Link,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tag,
  Text,
  VStack,
} from '@chakra-ui/react'
import {
  ElectionDescription,
  ElectionHeader,
  ElectionResults,
  ElectionSchedule,
  ElectionTitle,
} from '@vocdoni/chakra-components'
import { useElection } from '@vocdoni/react-providers'
import {
  ElectionStatus,
  IElectionInfoResponse,
  InvalidElection as InvalidElectionType,
  PublishedElection,
  VoteSummary,
} from '@vocdoni/sdk'
import { Trans, useTranslation } from 'react-i18next'
import { BiEnvelope } from 'react-icons/bi'
import { generatePath, Link as RouterLink } from 'react-router-dom'
import { ReducedTextAndCopy } from '~components/Layout/CopyButton'
import { HeroHeaderLayout } from '~components/Layout/HeroHeaderLayout'
import { LoadingCards } from '~components/Layout/Loading'
import { RawContentBox } from '~components/Layout/ShowRawButton'
import { OrganizationCard } from '~components/Organizations/Card'
import { ElectionStatusBadge } from '~components/Organizations/StatusBadge'
import { Pagination } from '~components/Pagination/Pagination'
import { PaginationProvider, usePagination } from '~components/Pagination/PaginationProvider'
import InvalidElection from '~components/Process/InvalidElection'
import { FallbackHeaderImg, RoutePath } from '~constants'
import { useElectionKeys, useElectionVotesList } from '~queries/processes'
import { ucfirst } from '~utils/strings'
import { RouteParamsTabs } from '~components/Layout/RouteParamsTabs'

const Detail = () => {
  const { election } = useElection()
  const { t } = useTranslation()

  if (!election) return null
  if (election instanceof InvalidElectionType) {
    return <InvalidElection />
  }

  const id = election.id

  const raw = election.raw as IElectionInfoResponse
  const censusOrigin = ucfirst(raw.census.censusOrigin.replace('_', ' ').toLocaleLowerCase())
  const autoStart = raw.electionMode.autoStart
    ? t('processes.process_mode_badge.autostart')
    : t('processes.process_mode_badge.notAutostart')
  const encryptedVotes = raw.voteMode.encryptedVotes
    ? t('processes.envelope_type_badge.encrypted_votes')
    : t('processes.envelope_type_badge.not_encrypted_votes')

  const defaultTab = election.status === ElectionStatus.ENDED || election.status === ElectionStatus.ONGOING ? 1 : 0

  return (
    <>
      {/*Hero Layout*/}
      <HeroHeaderLayout header={<ElectionHeader fallbackSrc={FallbackHeaderImg} />}>
        <VStack gap={2}>
          <ElectionStatusBadge status={election.status} />
          <ElectionTitle />
          <ReducedTextAndCopy color={'textAccent1'} toCopy={id} fontWeight={'normal'} h={0} fontSize={'md'}>
            {id}
          </ReducedTextAndCopy>
        </VStack>
      </HeroHeaderLayout>
      {/*Basic details */}
      <Flex direction={'column'}>
        <Text fontSize='3xl' color={'blueText'}>
          <Trans i18nKey={'process.process_details'}>Process details</Trans>
        </Text>
        <ElectionSchedule
          showRemaining
          fontWeight={'normal'}
          fontSize={'md'}
          textAlign={'start'}
          fontStyle={'normal'}
        />
        <ElectionSchedule
          showCreatedAt
          fontWeight={'normal'}
          fontSize={'md'}
          textAlign={'start'}
          fontStyle={'normal'}
        />
      </Flex>
      {/*Information tags */}
      <Flex wrap={'wrap'} gap={2}>
        {election.fromArchive && (
          <Tag variant={'vocdoni'}>
            <Trans i18nKey={'process.badge.archive'}>From archive</Trans>
          </Tag>
        )}
        {raw.voteMode.anonymous && (
          <Tag variant={'vocdoni'}>
            <Trans i18nKey={'process.badge.anonymous'}>Anonymous</Trans>
          </Tag>
        )}
        <Tag variant={'vocdoni'}>{censusOrigin}</Tag>
        <Tag variant={'vocdoni'}>{autoStart}</Tag>
        <Tag variant={'vocdoni'}>{encryptedVotes}</Tag>
      </Flex>
      {/*Organization card and other cards*/}
      <Grid templateColumns={{ base: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={4}>
        <GridItem colSpan={2}>
          <OrganizationCard h={'full'} />
        </GridItem>
        <GridItem colSpan={1}>
          <InfoCard title={t('processes.envelope_recount')}>{election.voteCount}</InfoCard>
        </GridItem>
        <GridItem colSpan={1}>
          <InfoCard title={t('processes.total_questions')}>{election.questions.length}</InfoCard>
        </GridItem>
      </Grid>
      {/*Encrypted votes */}
      {raw.voteMode.encryptedVotes && <ElectionKeys electionId={id} />}
      {/*Technical details tabs*/}
      <Text fontSize='2xl' color={'blueText'}>
        <Trans i18nKey={'process.detailed_data'}>Detailed data</Trans>
      </Text>
      <RouteParamsTabs defaultIndex={defaultTab} path={RoutePath.Process} isLazy>
        <Box whiteSpace='nowrap' overflowX='auto'>
          <TabList display='flex' flexWrap='wrap'>
            <Tab>
              <Trans i18nKey={'process.tab_description'}>Description</Trans>
            </Tab>
            <Tab>
              <Trans i18nKey={'process.tab_results'}>Results</Trans>
            </Tab>
            <Tab>
              <Trans i18nKey={'process.tab_envelopes'}>Envelopes</Trans>
            </Tab>
            <Tab>
              <Trans i18nKey={'process.tab_raw'}>Raw</Trans>
            </Tab>
          </TabList>
        </Box>
        <TabPanels>
          <TabPanel>
            {election.description?.default ? (
              <ElectionDescription />
            ) : (
              <Alert status='warning'>
                <AlertIcon />
                <Trans i18nKey={'process.no_description'}>No description set!</Trans>
              </Alert>
            )}
          </TabPanel>
          <TabPanel>
            <ElectionResults />
          </TabPanel>
          <TabPanel>
            <EnvelopeExplorer />
          </TabPanel>
          <TabPanel>
            <RawContentBox obj={raw} />
          </TabPanel>
        </TabPanels>
      </RouteParamsTabs>
    </>
  )
}

const InfoCard = ({ title, children, ...rest }: { title: string } & CardProps) => {
  return (
    <Card minH={'115px'} {...rest}>
      <CardHeader pb={0}>{title}</CardHeader>
      <CardBody>
        <Text fontSize={'xl'} fontWeight={'bold'}>
          {children}
        </Text>
      </CardBody>
    </Card>
  )
}

const ElectionKeys = ({ electionId }: { electionId: string }) => {
  const { data } = useElectionKeys({ electionId })
  const { t } = useTranslation()

  if (!data) return null

  return (
    <Flex direction={'column'} gap={4}>
      <Text fontSize='1xl' color={'blueText'}>
        <Trans i18nKey={'process.encryption_keys'}>Election encryption keys</Trans>
      </Text>
      <Grid templateColumns={{ base: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)' }} gap={4}>
        <GridItem colSpan={1}>
          <InfoCard title={t('processes.published_keys')}>{data.publicKeys?.length ?? 0}</InfoCard>
        </GridItem>
        <GridItem colSpan={1}>
          <InfoCard title={t('processes.revealed')}>{data.privateKeys?.length ?? 0}</InfoCard>
        </GridItem>
      </Grid>
    </Flex>
  )
}

const EnvelopeExplorer = () => {
  const { election: e } = useElection()
  const election = e as PublishedElection

  if (!election || election.voteCount === 0) {
    return (
      <Text>
        <Trans i18nKey={'election.no_votes_yet'}>No votes yet!</Trans>
      </Text>
    )
  }

  return (
    <PaginationProvider>
      <EnvelopeList />
    </PaginationProvider>
  )
}

const EnvelopeList = () => {
  const { page } = usePagination()
  const { election: e } = useElection()
  const election = e as PublishedElection

  const { data: envelopes, isLoading } = useElectionVotesList({
    params: {
      electionId: election?.id,
      page: page,
    },
    enabled: !!election?.id,
  })

  if (isLoading) {
    return <LoadingCards />
  }

  if (!envelopes) {
    // todo(kon): add error handling
    return null
  }

  return (
    <Flex direction={'column'} gap={4}>
      <Grid
        templateColumns={{ base: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(5, 1fr)' }}
        gap={4}
      >
        {envelopes?.votes.map((envelope, i) => {
          return <EnvelopeCard key={i} envelope={envelope} count={page * 10 + i + 1} />
        })}
      </Grid>
      <Pagination pagination={envelopes.pagination} />
    </Flex>
  )
}

const EnvelopeCard = ({ envelope, count }: { envelope: VoteSummary; count: number }) => {
  return (
    <Card maxW='xs'>
      <CardHeader>
        <Flex justify={'space-between'}>
          <Text fontWeight={'bold'}>
            <Trans i18nKey={'envelope.envelope_number'} num={count}>
              Envelope nº {{ num: count }}
            </Trans>
          </Text>
          <Box>
            <Icon color={'lightText'} as={BiEnvelope} />
          </Box>
        </Flex>
      </CardHeader>
      <CardBody>
        <Flex direction={'column'}>
          <Link
            as={RouterLink}
            to={generatePath(RoutePath.Block, { height: envelope.blockHeight.toString(), tab: null, page: null })}
          >
            <Trans i18nKey={'envelope.block'} height={envelope.blockHeight}>
              Block {{ height: envelope.blockHeight }}
            </Trans>
          </Link>
          <Link
            as={RouterLink}
            to={generatePath(RoutePath.Transaction, {
              block: envelope.blockHeight.toString(),
              index: envelope.transactionIndex.toString(),
              tab: null,
            })}
          >
            <Trans i18nKey={'envelope.tx_number'} transactionIndex={envelope.transactionIndex}>
              Transaction: {{ transactionIndex: envelope.transactionIndex }}
            </Trans>
          </Link>
          <Link as={RouterLink} to={generatePath(RoutePath.Envelope, { verifier: envelope.voteID })}>
            <Trans i18nKey={'envelope.details'}>Details</Trans>
          </Link>
        </Flex>
      </CardBody>
    </Card>
  )
}

export default Detail
