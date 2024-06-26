import {
  Box,
  Card,
  CardBody,
  CardHeader,
  CardProps,
  Flex,
  Grid,
  GridItem,
  Icon,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  Text,
  useBreakpointValue,
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
  IElectionVote,
  InvalidElection as InvalidElectionType,
  PublishedElection,
} from '@vocdoni/sdk'
import { FallbackHeaderImg, RoutePath } from '~constants'
import { HeroHeaderLayout } from '~src/layout/HeroHeaderLayout'
import { CopyButton, ReducedTextAndCopy } from '~components/CopyButton'
import { Trans, useTranslation } from 'react-i18next'
import { ElectionStatusBadge } from '~components/Organizations/StatusBadge'
import { OrganizationCard } from '~components/Organizations/Card'
import { RawContentBox } from '~src/layout/ShowRawButton'
import { useElectionKeys, useElectionVotesList } from '~queries/processes'
import { PaginationProvider, usePagination } from '~components/Pagination/PaginationProvider'
import { LoadingCards } from '~src/layout/Loading'
import { Pagination } from '~components/Pagination/Pagination'
import { BiEnvelope } from 'react-icons/bi'
import { ucfirst } from '~utils/strings'
import InvalidElection from '~components/Process/InvalidElection'
import { generatePath, Link as RouterLink } from 'react-router-dom'

const Detail = () => {
  const { election } = useElection()
  const { t } = useTranslation()
  const isSmallScreen = useBreakpointValue({ base: true, md: false })

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
      <Grid templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)' }} gap={4}>
        <GridItem colSpan={{ base: 1, md: 2 }}>
          <OrganizationCard />
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
      <Tabs defaultIndex={defaultTab}>
        <TabList>
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

        <TabPanels>
          <TabPanel>
            <ElectionDescription />
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
      </Tabs>
    </>
  )
}

const InfoCard = ({ title, children, ...rest }: { title: string } & CardProps) => {
  return (
    <Card {...rest}>
      <CardHeader>{title}</CardHeader>
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
          <InfoCard title={t('processes.published_keys')}>{data.publicKeys.length}</InfoCard>
        </GridItem>
        <GridItem colSpan={1}>
          <InfoCard title={t('processes.revealed')}>{data.privateKeys.length}</InfoCard>
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
    <PaginationProvider totalPages={Math.ceil(election.voteCount / 10)}>
      <Flex direction={'column'} gap={4}>
        <EnvelopeList />
        <Pagination />
      </Flex>
    </PaginationProvider>
  )
}

const EnvelopeList = () => {
  const { page } = usePagination()
  const { election: e } = useElection()
  const election = e as PublishedElection

  const { data: envelopes, isLoading } = useElectionVotesList({
    electionId: election?.id ?? '',
    page: page,
    enabled: !!election?.id,
  })

  if (isLoading) {
    return <LoadingCards />
  }

  return (
    <Grid
      templateColumns={{ base: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(5, 1fr)' }}
      gap={4}
    >
      {envelopes?.votes.map((envelope, i) => {
        return <EnvelopeCard envelope={envelope} count={page * 10 + i + 1} />
      })}
    </Grid>
  )
}

const EnvelopeCard = ({ envelope, count }: { envelope: IElectionVote; count: number }) => {
  const { i18n } = useTranslation()
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
          <Text as={RouterLink} to={generatePath(RoutePath.Block, { height: envelope.blockHeight.toString() })}>
            <Trans i18nKey={'envelope.block'} height={envelope.blockHeight}>
              Block {{ height: envelope.blockHeight }}
            </Trans>
          </Text>
          <Text
            as={RouterLink}
            to={generatePath(RoutePath.Transaction, {
              block: envelope.blockHeight.toString(),
              index: envelope.transactionIndex.toString(),
            })}
          >
            <Trans i18nKey={'envelope.tx_number'} transactionIndex={envelope.transactionIndex}>
              Transaction: {{ transactionIndex: envelope.transactionIndex }}
            </Trans>
          </Text>
          <Text as={RouterLink} to={generatePath(RoutePath.Envelope, { verifier: envelope.voteID })}>
            <Trans i18nKey={'envelope.details'}>Details</Trans>
          </Text>
        </Flex>
      </CardBody>
    </Card>
  )
}

export default Detail
