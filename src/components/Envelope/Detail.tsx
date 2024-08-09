import voteImage from '/images/vocdoni-vote.png'
import { Flex, Image, Link, Tab, TabList, TabPanel, TabPanels, Text } from '@chakra-ui/react'
import { IVoteInfoResponse, PublishedElection } from '@vocdoni/sdk'
import { formatDistance } from 'date-fns'
import { Trans, useTranslation } from 'react-i18next'
import { generatePath, Link as RouterLink } from 'react-router-dom'
import { CopyButton, ReducedTextAndCopy } from '~components/Layout/CopyButton'
import { RawContentBox } from '~components/Layout/ShowRawButton'
import { RoutePath } from '~constants'
import { RouteParamsTabs } from '~components/Layout/RouteParamsTabs'
import { DetailsGrid, GridItemProps } from '~components/Layout/DetailsGrid'
import { processIdGridItem } from '~components/Transactions/TxDetails/SpecificTxDetails'
import { Envelope, VotePackageType } from '@vocdoni/chakra-components'
import { ElectionProvider, useElection } from '@vocdoni/react-providers'

/**
 * Show envelope content
 * @param route this is needed to use the RoutedParamsTabs
 * @param envelope envelope data
 * @constructor
 */
const EnvelopeDetail = ({
  route,
  ...envelope
}: { route: RoutePath.Envelope | RoutePath.Verify } & IVoteInfoResponse) => {
  const { t } = useTranslation()

  return (
    <Flex direction={'column'} mt={'40px'} gap={6} wordBreak='break-all'>
      <Flex direction={'column'} alignItems={'center'} gap={6}>
        <Image w={'100px'} src={voteImage} alt={t('envelopes.vote_registered')} />
        <Text fontWeight={'bold'} fontSize={'xl'}>
          <Trans i18nKey={'envelopes.registered_correctly'}>Vote has been registered correctly</Trans>
        </Text>
        <Flex direction={'column'} gap={1} alignItems={'center'} textAlign={'center'}>
          <Text fontWeight={'bold'} fontSize={'md'}>
            <Trans i18nKey={'envelopes.verifier_code'}>Verifier code</Trans>
          </Text>
          <CopyButton
            whiteSpace='normal'
            wordBreak='break-all'
            w={'auto'}
            toCopy={envelope.voteID}
            color={'textAccent1'}
          >
            <Text wordBreak={'break-all'}>{envelope.voteID}</Text>
          </CopyButton>
        </Flex>
      </Flex>
      <RouteParamsTabs path={route} isLazy>
        <TabList display='flex' flexWrap='wrap'>
          <Tab>
            <Trans i18nKey={'envelopes.content'}>Envelope Content</Trans>
          </Tab>
          <Tab>
            <Trans i18nKey={'process.tab_details'}>Details</Trans>
          </Tab>
          <Tab>
            <Trans i18nKey={'raw'}>Raw</Trans>
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <ElectionProvider id={envelope.electionID}>
              <VotePackage votePackage={envelope.package} />
            </ElectionProvider>
          </TabPanel>
          <TabPanel>
            <EnvelopeDetailsGrid {...envelope} />
          </TabPanel>
          <TabPanel>
            <RawContentBox obj={envelope} />
          </TabPanel>
        </TabPanels>
      </RouteParamsTabs>
    </Flex>
  )
}

export const VotePackage = ({ votePackage }: { votePackage: VotePackageType }) => {
  const { t } = useTranslation()
  const { election } = useElection()
  if (!election || !(election instanceof PublishedElection)) return null

  return (
    <Flex direction={'column'}>
      <Envelope votePackage={votePackage} />
      <Text fontSize={'sm'} as='i'>
        <Trans
          i18nKey={'envelopes.from_election_title'}
          components={{
            a: <Link as={RouterLink} to={generatePath(RoutePath.Process, { pid: election.id, tab: null })} />,
          }}
          values={{ title: election.title.default }}
        />
      </Text>
    </Flex>
  )
}

const EnvelopeDetailsGrid = (envelope: IVoteInfoResponse) => {
  const { t } = useTranslation()

  const emitted = formatDistance(new Date(envelope.date), new Date(), { addSuffix: true })
  const encKeys = envelope.encryptionKeys?.join(',')

  const details: GridItemProps[] = [
    {
      label: t('envelopes.emitted', { defaultValue: 'Emitted' }),
      children: <Text>{emitted}</Text>,
    },
    ...(envelope.overwriteCount > 0
      ? [
          {
            label: t('envelopes.overwrite_count', { defaultValue: 'Overwrite count' }),
            children: envelope.overwriteCount,
          },
        ]
      : []),
    {
      label: 'Overwrite count',
      children: <Text>{envelope.overwriteCount}</Text>,
    },
    ...(encKeys && encKeys?.length > 0
      ? [
          {
            label: t('envelopes.encryption_keys', { defaultValue: 'Encryption keys' }),
            children: encKeys,
          },
        ]
      : []),
    {
      label: t('envelopes.envelope_weight', { defaultValue: 'Envelope weight' }),
      children: <Text>{envelope.weight}</Text>,
    },
    {
      label: t('envelopes.committed_in_block', { defaultValue: 'Committed in block' }),
      children: (
        <Link
          as={RouterLink}
          to={generatePath(RoutePath.Block, { height: envelope.blockHeight.toString(), tab: null, page: null })}
        >
          {envelope.blockHeight}
        </Link>
      ),
    },
    {
      label: t('envelopes.on_transaction', { defaultValue: 'On Transaction' }),
      children: (
        <ReducedTextAndCopy
          breakPoint={{ base: true, lg: false }}
          pl={0}
          color={'textAccent1'}
          toCopy={envelope.txHash}
          fontWeight={'normal'}
          h={0}
          fontSize={'md'}
          to={generatePath(RoutePath.Transaction, {
            block: envelope.blockHeight.toString(),
            index: envelope.transactionIndex.toString(),
            tab: null,
          })}
        >
          {envelope.txHash}
        </ReducedTextAndCopy>
      ),
    },
    { ...processIdGridItem(envelope.electionID, t) },
  ]
  return <DetailsGrid details={details} />
}

export default EnvelopeDetail
