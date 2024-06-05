import { Button, Stack } from '@chakra-ui/react'
import { Trans } from 'react-i18next'
import { BlockCard } from '~components/Blocks/BlockCard'
import { useBlockList } from '~queries/blocks'
import { useChainInfo } from '~queries/stats'
import { LoadingCards } from '~src/router/SuspenseLoader'

export const LatestBlocks = () => {
  const blockListSize = 4

  const { data: stats, isLoading: isLoadingStats } = useChainInfo()
  const { data: blocks, isLoading: isLoadingBlocks } = useBlockList({
    enabled: !!stats?.height,
    from: (stats?.height || 0) - (blockListSize - 1),
    listSize: blockListSize,
  })

  const isLoading = isLoadingStats || isLoadingBlocks

  if (isLoading || !stats || !stats?.height || !blocks) {
    return <LoadingCards length={blockListSize} />
  }

  return (
    <Stack>
      {blocks.map((block, i) => {
        return (
          <BlockCard
            key={i}
            height={block.header.height}
            time={block.header.time}
            proposer={block.header.proposerAddress}
          />
        )
      })}
      <Button bgColor='accent1' color={'white'}>
        <Trans i18nKey='stats.view_all_blocks'>View all blocks</Trans>
      </Button>
    </Stack>
  )
}
