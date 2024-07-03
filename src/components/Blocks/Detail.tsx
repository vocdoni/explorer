import { IChainBlockInfoResponse } from '@vocdoni/sdk'
import { BlockCard } from '~components/Blocks/BlockCard'
import { Flex, Heading, Link, Text } from '@chakra-ui/react'
import { generatePath, Link as RouterLink } from 'react-router-dom'
import { Trans } from 'react-i18next'
import { RoutePath } from '~constants'
import ShowRawButton from '~components/Layout/ShowRawButton'

export const BlockDetail = ({ block }: { block: IChainBlockInfoResponse }) => {
  const proposer = block.header.proposerAddress

  return (
    <Flex direction={'column'} mt={{ base: '20px', lg: '40px' }} gap={6} wordBreak='break-all'>
      <Heading isTruncated wordBreak='break-word'>
        <Trans i18nKey={'blocks.block_detail'}>Block Detail</Trans>
      </Heading>
      <BlockCard height={block.header.height} time={block.header.time} proposer={proposer} />
      <Text>
        <Trans i18nKey={'blocks.transactions_count'} count={block.data.txs.length}>
          Transactions: {{ count: block.data.txs.length }}
        </Trans>
      </Text>
      <Text>
        <Trans i18nKey={'blocks.hash'} hash={block.hash}>
          Hash: {{ hash: block.hash }}
        </Trans>
      </Text>
      <Text>
        <Trans i18nKey={'blocks.previous_block_hash'} hash={block.header.lastBlockId.hash}>
          Previous block hash:{' '}
        </Trans>
        <Link as={RouterLink} to={generatePath(RoutePath.Block, { height: (block.header.height - 1).toString() })}>
          {block.hash}
        </Link>
      </Text>
      <Text>
        <Trans i18nKey={'blocks.proposer_id'} proposer={proposer}>
          Proposer: {{ proposer: proposer }}
        </Trans>
      </Text>
      <ShowRawButton obj={block} />
    </Flex>
  )
}
