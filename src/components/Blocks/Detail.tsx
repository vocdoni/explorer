import { Flex, Heading, IconButton, Tab, TabList, TabPanel, TabPanels, Text, VStack } from '@chakra-ui/react'
import { ensure0x, IChainBlockInfoResponse } from '@vocdoni/sdk'
import { Trans, useTranslation } from 'react-i18next'
import { GrNext, GrPrevious } from 'react-icons/gr'
import { generatePath, Link as RouterLink } from 'react-router-dom'
import { ReducedTextAndCopy } from '~components/Layout/CopyButton'
import { DetailsGrid, GridItemProps } from '~components/Layout/DetailsGrid'
import { QueryParamsTabs } from '~components/Layout/QueryParamsTabs'
import { RawContentBox } from '~components/Layout/ShowRawButton'
import { BlockTransactionsList } from '~components/Transactions/TransactionList'
import { RefreshIntervalBlocks, RoutePath } from '~constants'
import { useDateFns } from '~i18n/use-date-fns'
import { useBlocksHeight } from '~queries/blocks'

const HeightNavigator = ({ height }: { height: number }) => {
  const { data, isLoading } = useBlocksHeight({
    refetchInterval: RefreshIntervalBlocks,
  })
  const { t } = useTranslation()

  if (!data) {
    return null
  }

  return (
    <Flex justifyContent={'start'} gap={2}>
      <Text>{height}</Text>
      {height >= 1 && (
        <IconButton
          as={RouterLink}
          to={generatePath(RoutePath.Block, { height: (height - 1).toString(), page: null })}
          aria-label={t('blocks.previous_block')}
          icon={<GrPrevious />}
          size={'xs'}
        />
      )}
      {height < data && (
        <IconButton
          as={RouterLink}
          to={generatePath(RoutePath.Block, { height: (height + 1).toString(), page: null })}
          aria-label={t('blocks.next_block')}
          icon={<GrNext />}
          size={'xs'}
        />
      )}
    </Flex>
  )
}

const DetailsTab = ({ block }: { block: IChainBlockInfoResponse }) => {
  const proposer = ensure0x(block.header.proposerAddress)
  const height = block.header.height
  const hash = ensure0x(block.hash)
  const date = new Date(block.header.time)

  const { t } = useTranslation()

  const details: GridItemProps[] = [
    {
      label: t('blocks.height', { defaultValue: 'Height' }),
      children: <HeightNavigator height={height} />,
    },
    {
      label: t('blocks.timestamp', { defaultValue: 'Timestamp' }),
      children: date.toString(),
    },
    {
      label: t('blocks.transactions', { defaultValue: 'Transactions' }),
      children: block.data.txs.length,
    },
    {
      label: t('blocks.hash', { defaultValue: 'Hash' }),
      children: (
        <ReducedTextAndCopy
          breakPoint={{ base: true, lg: false }}
          p={0}
          color={'textAccent1'}
          toCopy={hash}
          fontWeight={'normal'}
          h={0}
          fontSize={'md'}
        >
          {hash}
        </ReducedTextAndCopy>
      ),
    },
    {
      label: t('blocks.proposer', { defaultValue: 'Proposer' }),
      children: (
        <ReducedTextAndCopy
          breakPoint={{ base: true, md: false }}
          p={0}
          color={'textAccent1'}
          toCopy={proposer}
          fontWeight={'normal'}
          h={0}
          fontSize={'md'}
          to={generatePath(RoutePath.Validator, { address: proposer })}
        >
          {proposer}
        </ReducedTextAndCopy>
      ),
    },
  ]

  return (
    <VStack align='start'>
      <DetailsGrid details={details} />
    </VStack>
  )
}

export const BlockDetail = ({ block }: { block: IChainBlockInfoResponse }) => {
  const height = block.header.height
  const date = new Date(block.header.time)

  const { formatDistance } = useDateFns()

  return (
    <Flex direction={'column'} mt={{ base: '20px', lg: '40px' }} gap={6} wordBreak='break-all'>
      <VStack align='start'>
        <Heading isTruncated wordBreak='break-word' mb={0}>
          <Trans i18nKey={'blocks.block_detail'} height={height}>
            Block #{{ height }}
          </Trans>
        </Heading>
        <Text mt={0} fontWeight={'bold'} color={'lighterText'}>
          {formatDistance(date, new Date())}
        </Text>
      </VStack>
      <QueryParamsTabs isLazy>
        <TabList display='flex' flexWrap='wrap'>
          <Tab>
            <Trans i18nKey={'process.tab_details'}>Details</Trans>
          </Tab>
          <Tab>
            <Trans i18nKey={'process.tab_txs'}>Transactions</Trans>
          </Tab>
          <Tab>
            <Trans i18nKey={'raw'}>Raw</Trans>
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <DetailsTab block={block} />
          </TabPanel>
          <TabPanel>
            <BlockTransactionsList blockHeight={height} totalTxs={block.data.txs.length} />
          </TabPanel>
          <TabPanel>
            <RawContentBox obj={block} />
          </TabPanel>
        </TabPanels>
      </QueryParamsTabs>
    </Flex>
  )
}
