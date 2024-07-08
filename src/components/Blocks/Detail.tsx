import { Flex, Grid, GridItem, Heading, IconButton, Text, VStack } from '@chakra-ui/react'
import { IChainBlockInfoResponse } from '@vocdoni/sdk'
import { Trans, useTranslation } from 'react-i18next'
import ShowRawButton from '~components/Layout/ShowRawButton'
import { useDateFns } from '~i18n/use-date-fns'
import { PropsWithChildren } from 'react'
import { ResponsiveTextCopy } from '~components/Layout/CopyButton'
import { GrNext, GrPrevious } from 'react-icons/gr'
import { RefreshIntervalBlocks, RoutePath } from '~constants'
import { useBlocksHeight } from '~queries/blocks'
import { generatePath, Link as RouterLink } from 'react-router-dom'

const DetailRow = ({ label, children }: { label: string } & PropsWithChildren) => {
  return (
    <>
      <GridItem>
        <Text fontWeight={'bold'}>{label}</Text>
      </GridItem>
      <GridItem>{children}</GridItem>
    </>
  )
}

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

  return (
    <VStack align='start'>
      <Grid templateColumns={{ base: '1fr', sm: '1fr 4fr' }} gap={2} alignItems='start'>
        <DetailRow label={t('blocks.height', { defaultValue: 'Height' })}>
          <HeightNavigator height={height} />
        </DetailRow>
        <DetailRow label={t('blocks.timestamp', { defaultValue: 'Timestamp' })}>{date.toString()}</DetailRow>
        <DetailRow label={t('blocks.transactions', { defaultValue: 'Transactions' })}>
          {block.data.txs.length}
        </DetailRow>
        <DetailRow label={t('blocks.hash', { defaultValue: 'Hash' })}>
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
        </DetailRow>
        <DetailRow label={t('blocks.proposer', { defaultValue: 'Proposer' })}>
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
        </DetailRow>
      </Grid>
    </VStack>
  )
}

export const BlockDetail = ({ block }: { block: IChainBlockInfoResponse }) => {
  const height = block.header.height
  const date = new Date(block.header.time)

  const { formatDistance } = useDateFns()
  const { t } = useTranslation()

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
      <DetailsTab block={block} />
      <ShowRawButton obj={block} />
    </Flex>
  )
}
