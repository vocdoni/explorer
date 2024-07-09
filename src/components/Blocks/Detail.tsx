import { Flex, Heading, IconButton, Tab, TabList, TabPanel, TabPanels, Text, VStack } from '@chakra-ui/react'
import { IChainBlockInfoResponse } from '@vocdoni/sdk'
import { Trans, useTranslation } from 'react-i18next'
import { RawContentBox } from '~components/Layout/ShowRawButton'
import { useDateFns } from '~i18n/use-date-fns'
import { ResponsiveTextCopy } from '~components/Layout/CopyButton'
import { GrNext, GrPrevious } from 'react-icons/gr'
import { RefreshIntervalBlocks, RoutePath } from '~constants'
import { useBlocksHeight } from '~queries/blocks'
import { generatePath, Link as RouterLink } from 'react-router-dom'
import { DetailsGrid, GridItemProps } from '~components/Layout/DetailsGrid'
import { QueryParamsTabs } from '~components/Layout/QueryParamsTabs'

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
          to={generatePath(RoutePath.Block, { height: (height - 1).toString() })}
          aria-label={t('blocks.previous_block')}
          icon={<GrPrevious />}
          size={'xs'}
        />
      )}
      {height < data && (
        <IconButton
          as={RouterLink}
          to={generatePath(RoutePath.Block, { height: (height + 1).toString() })}
          aria-label={t('blocks.next_block')}
          icon={<GrNext />}
          size={'xs'}
        />
      )}
    </Flex>
  )
}

const DetailsTab = ({ block }: { block: IChainBlockInfoResponse }) => {
  const proposer = block.header.proposerAddress
  const height = block.header.height
  const hash = block.hash
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
        <ResponsiveTextCopy
          breakPoint={{ base: true, lg: false }}
          p={0}
          color={'textAccent1'}
          toCopy={hash}
          fontWeight={'normal'}
          h={0}
          fontSize={'md'}
        >
          {hash}
        </ResponsiveTextCopy>
      ),
    },
    {
      label: t('blocks.proposer', { defaultValue: 'Proposer' }),
      children: (
        <ResponsiveTextCopy
          breakPoint={{ base: true, md: false }}
          p={0}
          color={'textAccent1'}
          toCopy={proposer}
          fontWeight={'normal'}
          h={0}
          fontSize={'md'}
        >
          {proposer}
        </ResponsiveTextCopy>
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
            <DetailsTab block={block} />
          </TabPanel>
          <TabPanel>
            <RawContentBox obj={block} />
          </TabPanel>
        </TabPanels>
      </QueryParamsTabs>
    </Flex>
  )
}
