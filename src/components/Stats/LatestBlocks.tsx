import { Button, Stack } from '@chakra-ui/react'
import { Trans } from 'react-i18next'
import { generatePath, Link as RouterLink } from 'react-router-dom'
import { BlockCard } from '~components/Blocks/BlockCard'
import { RoutePath } from '~constants'
import { useBlockList } from '~queries/blocks'
import { useChainInfo } from '~queries/stats'
import { LoadingCards } from '~src/layout/Loading'

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
      <Button as={RouterLink} to={generatePath(RoutePath.BlocksList)} bgColor='accent1' color={'white'}>
        <Trans i18nKey='stats.view_all_blocks'>View all blocks</Trans>
      </Button>
    </Stack>
  )
}
