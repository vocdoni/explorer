import {
  Box,
  Card,
  CardBody,
  CardHeader,
  CardProps,
  Flex,
  Grid,
  GridItem,
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
  QuestionsTypeBadge,
} from '@vocdoni/chakra-components'
import { useElection } from '@vocdoni/react-providers'
import { ElectionStatus, IElectionInfoResponse, InvalidElection as InvalidElectionType } from '@vocdoni/sdk'
import { Trans, useTranslation } from 'react-i18next'
import { AccountCard } from '~components/Accounts/Card'
import { ElectionStatusBadge } from '~components/Accounts/StatusBadge'
import { PaginatedEnvelopeList } from '~components/Envelope/EnvelopeList'
import { NoResultsError } from '~components/Layout/ContentError'
import { ReducedTextAndCopy } from '~components/Layout/CopyButton'
import { ErrorBoundary } from '~components/Layout/ErrorBoundary'
import { HeroHeaderLayout } from '~components/Layout/HeroHeaderLayout'
import { RouteParamsTabs } from '~components/Layout/RouteParamsTabs'
import { RawContentBox } from '~components/Layout/ShowRawButton'
import InvalidElection from '~components/Process/InvalidElection'
import { FallbackHeaderImg, RoutePath } from '~constants'
import { useElectionKeys } from '~queries/processes'
import { ucfirst } from '~utils/strings'

const Detail = () => {
  const { election } = useElection()
  const { t } = useTranslation()

  if (!election) return null
  if (election instanceof InvalidElectionType) {
    return <InvalidElection />
  }

  const id = election.id

  // Note the response is not always complete: processes created from the SaaS store their
  // metadata outside IPFS, which the node can't resolve, so it ships them without a
  // `metadata` key. Never dereference `raw` without guarding.
  const raw = election.raw as IElectionInfoResponse
  const censusOrigin = raw.census?.censusOrigin
    ? raw.census.censusOrigin
        .replaceAll('_', ' ')
        .toLocaleLowerCase()
        .split(' ')
        .map((x) => ucfirst(x))
        .join(' ')
    : ''
  const encryptedVotes = raw.voteMode?.encryptedVotes
    ? t('processes.envelope_type_badge.encrypted_votes')
    : t('processes.envelope_type_badge.not_encrypted_votes')

  const defaultTab = election.status === ElectionStatus.ENDED || election.status === ElectionStatus.ONGOING ? 1 : 0

  return (
    <>
      {/*Hero Layout*/}
      <HeroHeaderLayout
        header={
          <ErrorBoundary fallback={null} resetKeys={[id]}>
            <ElectionHeader fallbackSrc={FallbackHeaderImg} />
          </ErrorBoundary>
        }
      >
        <VStack gap={2}>
          <ElectionStatusBadge status={election.status} />
          <ErrorBoundary fallback={<UntitledProcess />} resetKeys={[id]}>
            {election.title?.default ? <ElectionTitle /> : <UntitledProcess />}
          </ErrorBoundary>
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
      <ErrorBoundary fallback={null} resetKeys={[id]}>
        <Flex wrap={'wrap'} gap={2}>
          {/* QuestionsTypeBadge dereferences resultsType, which is absent without metadata */}
          {!!election.resultsType?.name && <QuestionsTypeBadge />}
          {raw.voteMode?.anonymous && (
            <Tag variant={'vocdoni'}>
              <Trans i18nKey={'process.badge.anonymous'}>Anonymous</Trans>
            </Tag>
          )}
          {!!censusOrigin && <Tag variant={'vocdoni'}>{censusOrigin}</Tag>}
          <Tag variant={'vocdoni'}>{encryptedVotes}</Tag>
        </Flex>
      </ErrorBoundary>
      {/*Organization card and other cards*/}
      <Grid templateColumns={{ base: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={4}>
        <GridItem colSpan={2}>
          <AccountCard h={'full'} />
        </GridItem>
        <GridItem colSpan={1}>
          <InfoCard title={t('processes.envelope_recount')}>{election.voteCount}</InfoCard>
        </GridItem>
        <GridItem colSpan={1}>
          <InfoCard title={t('processes.total_questions')}>{election.questions.length}</InfoCard>
        </GridItem>
      </Grid>
      {/*Encrypted votes */}
      {raw.voteMode?.encryptedVotes && <ElectionKeys electionId={id} />}
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
            <ErrorBoundary>
              {election.description?.default ? (
                <ElectionDescription />
              ) : (
                <NoResultsError msg={t('process.no_description', { defaultValue: 'No description set!' })} />
              )}
            </ErrorBoundary>
          </TabPanel>
          <TabPanel>
            <ErrorBoundary>
              {election.questions.length ? (
                <ElectionResults />
              ) : (
                <NoResultsError msg={t('process.no_results', { defaultValue: 'No results to show.' })} />
              )}
            </ErrorBoundary>
          </TabPanel>
          <TabPanel>
            <ErrorBoundary>
              <PaginatedEnvelopeList />
            </ErrorBoundary>
          </TabPanel>
          {/* Raw is the one tab that must render whatever the metadata looks like: it only
              depends on the untouched API response, never on parsed metadata */}
          <TabPanel>
            <RawContentBox obj={raw} />
          </TabPanel>
        </TabPanels>
      </RouteParamsTabs>
    </>
  )
}

/**
 * Shown in place of the title when the process has no readable metadata, so the hero is
 * never left blank.
 */
const UntitledProcess = () => (
  <Text fontSize={'2xl'} fontWeight={'bold'} textAlign={'center'} color={'textAccent1'}>
    <Trans i18nKey={'process.untitled'}>Untitled process</Trans>
  </Text>
)

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

export default Detail
