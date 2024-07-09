import { Code, Flex, Heading, StackDivider, Tab, TabList, TabPanel, TabPanels, Text, VStack } from '@chakra-ui/react'
import { AdminTx, ensure0x, NewProcessTx, SetProcessTx, TransactionType, Tx, VoteEnvelope } from '@vocdoni/sdk'
import { Trans, useTranslation } from 'react-i18next'
import { generatePath, Link as RouterLink } from 'react-router-dom'
import { RawContentBox } from '~components/Layout/ShowRawButton'
import { RoutePath } from '~constants'
import { useDateFns } from '~i18n/use-date-fns'
import { useBlockToDate } from '~queries/stats'
import { b64ToHex, objectB64StringsToHex } from '~utils/objects'
import { QueryParamsTabs } from '~components/Layout/QueryParamsTabs'
import { DetailsGrid, GridItemProps } from '~components/Layout/DetailsGrid'
import { TransactionTypeBadge } from '~components/Transactions/TransactionCard'
import { ReducedTextAndCopy } from '~components/Layout/CopyButton'

export const TransactionDetail = (tx: Tx) => {
  const { data } = useBlockToDate({ height: tx.txInfo.blockHeight })
  const { formatDistance } = useDateFns()
  const { t } = useTranslation()

  let createdOn = ''
  let timestamp = ''
  if (data) {
    createdOn = formatDistance(new Date(data.date), new Date())
    timestamp = new Date(data.date).toString()
  }

  const blockHeight = tx.txInfo.blockHeight
  const txIndex = tx.txInfo.transactionIndex

  let entity = ''
  let process = ''
  let votePackage = ''

  if (!tx.tx) return

  const txHash = ensure0x(tx.txInfo.transactionHash)
  const txPayload = tx.tx as any
  const txType = Object.keys(tx.tx)[0] as TransactionType

  // For some reason, response payload converted transactions have some
  // values into base64 string. This values, on the interface declaration are
  // `Uint8Array`, but on JSON decoding are treated as 'strings'.
  // So is a little bit tricky to know if a payload value have to be
  // converted to a b64 or not. Probably reflection could help with that. BTW
  // is solved checking regex.

  const rawTx = JSON.parse(JSON.stringify(tx))
  objectB64StringsToHex(rawTx, ['txInfo'])

  switch (txType) {
    case 'vote': {
      const voteTx = txPayload.vote as VoteEnvelope
      if (voteTx.votePackage) {
        // Decode the vote package from base64
        votePackage = atob(voteTx.votePackage)
        // And copy it alsow to rawTx
        rawTx['tx']['vote']['votePackage'] = JSON.parse(votePackage)
      }
      process = ensure0x(b64ToHex(voteTx.processId))
      break
    }
    case 'newProcess': {
      const newProcessTx = txPayload.newProcess as NewProcessTx
      if (newProcessTx.process) {
        process = ensure0x(b64ToHex(newProcessTx.process.processId as unknown as string))
        entity = ensure0x(b64ToHex(newProcessTx.process.entityId as unknown as string))
      }
      break
    }
    case 'admin': {
      const adminTx = txPayload.admin as AdminTx
      process = ensure0x(b64ToHex(adminTx.processId as unknown as string))
      break
    }
    case 'setProcess': {
      const setProcessTx = txPayload.setProcess as SetProcessTx
      process = ensure0x(b64ToHex(setProcessTx.processId as unknown as string))

      if (setProcessTx?.results) {
        entity = ensure0x(b64ToHex(setProcessTx.results.entityId as unknown as string))
      }
      break
    }
  }

  const sharedDetails: GridItemProps[] = [
    {
      label: t('transactions.tx_type', { defaultValue: 'Transaction type' }),
      children: <TransactionTypeBadge transactionType={txType} />,
    },
    ...(timestamp
      ? [
          {
            label: t('blocks.timestamp', { defaultValue: 'Timestamp' }),
            children: timestamp,
          },
        ]
      : []),
    {
      label: t('transactions.tx_hash', { defaultValue: 'Transaction hash' }),
      children: (
        <ReducedTextAndCopy
          breakPoint={{ base: true, lg: false }}
          p={0}
          color={'textAccent1'}
          toCopy={txHash}
          fontWeight={'normal'}
          h={0}
          fontSize={'md'}
        >
          {txHash}
        </ReducedTextAndCopy>
      ),
    },
    {
      label: t('transactions.block', { defaultValue: 'Block' }),
      children: (
        <Text
          as={RouterLink}
          to={generatePath(RoutePath.Block, { height: blockHeight.toString() })}
          color={'textAccent1'}
        >
          {blockHeight}
        </Text>
      ),
    },
    {
      label: t('transactions.tx_index', { defaultValue: 'Transaction index' }),
      children: txIndex,
    },
  ]

  const specificDetails: GridItemProps[] = []
  if (process) {
    specificDetails.push({
      label: t('transactions.belongs_to_process', { defaultValue: 'Belongs to process' }),
      children: (
        <ReducedTextAndCopy
          breakPoint={{ base: true, lg: false }}
          p={0}
          color={'textAccent1'}
          toCopy={process}
          fontWeight={'normal'}
          h={0}
          fontSize={'md'}
          to={generatePath(RoutePath.Block, { height: blockHeight.toString() })}
        >
          {process}
        </ReducedTextAndCopy>
      ),
    })
  }

  if (entity) {
    specificDetails.push({
      label: t('transactions.belong_to_organization', { defaultValue: 'Belongs to organization' }),
      children: (
        <ReducedTextAndCopy
          breakPoint={{ base: true, lg: false }}
          p={0}
          color={'textAccent1'}
          toCopy={entity}
          fontWeight={'normal'}
          h={0}
          fontSize={'md'}
          to={generatePath(RoutePath.Organization, { pid: entity, page: null })}
        >
          {entity}
        </ReducedTextAndCopy>
      ),
    })
  }

  if (votePackage) {
    specificDetails.push({
      label: t('transactions.vote_package', { defaultValue: 'Vote package' }),
      children: <Code>{votePackage}</Code>,
    })
  }

  return (
    <Flex direction={'column'} mt={'40px'} gap={6}>
      <VStack align='start'>
        <Heading isTruncated wordBreak='break-word' mb={0}>
          <Trans i18nKey={'transactions.tx_detail'}>Transaction Details</Trans>
        </Heading>
        {createdOn && (
          <Text mt={0} fontWeight={'bold'} color={'lighterText'}>
            <Trans i18nKey={'transactions.created_on'} createdOn={createdOn}>
              Created {{ createdOn }}
            </Trans>
          </Text>
        )}
      </VStack>
      <QueryParamsTabs>
        <TabList display='flex' flexWrap='wrap'>
          <Tab>
            <Trans i18nKey={'process.tab_details'}>Details</Trans>
          </Tab>
          <Tab>
            <Trans i18nKey={'raw'}>Raw</Trans>
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <VStack divider={<StackDivider borderColor='gray.200' />} spacing={4} align='stretch'>
              <DetailsGrid details={sharedDetails} />
              {specificDetails && <DetailsGrid details={specificDetails} />}
            </VStack>
          </TabPanel>
          <TabPanel>
            <RawContentBox obj={rawTx} />
          </TabPanel>
        </TabPanels>
      </QueryParamsTabs>
    </Flex>
  )
}
