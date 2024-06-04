import { Button, Card, CardBody, SkeletonText, Stack } from '@chakra-ui/react'
import { Trans } from 'react-i18next'
import { BlockCard } from '~components/Blocks/BlockCard'
import { useBlockList } from '~src/queries/blocks'
import { useChainInfo } from '~src/queries/stats'

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
    return (
      <Stack>
        {Array.from({ length: blockListSize }).map((_, index) => (
          <Card>
            <CardBody>
              <SkeletonText noOfLines={3} spacing='3' skeletonHeight='3' />
            </CardBody>
          </Card>
        ))}
      </Stack>
    )
  }

  return (
    <Stack>
      {blocks.map((block) => {
        return (
          <BlockCard height={block.header.height} time={block.header.time} proposer={block.header.proposerAddress} />
        )
      })}
      <Button bgColor='accent1' color={'white'}>
        <Trans i18nKey='stats.view_all_blocks'>View all blocks</Trans>
      </Button>
    </Stack>
  )
}
