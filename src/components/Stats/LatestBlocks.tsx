import { Button, Stack } from '@chakra-ui/react'
import { keepPreviousData } from '@tanstack/react-query'
import { Trans } from 'react-i18next'
import { generatePath, Link as RouterLink } from 'react-router-dom'
import { BlockCard } from '~components/Blocks/BlockCard'
import { ContentError } from '~components/Layout/ContentError'
import { LoadingCards } from '~components/Layout/Loading'
import { RoutePath } from '~constants'
import { useBlockList } from '~queries/blocks'
import { useChainInfo } from '~queries/stats'

export const LatestBlocks = () => {
  const blockListSize = 3

  const { data: stats, isLoading: isLoadingStats } = useChainInfo()
  const {
    data: blocks,
    isLoading: isLoadingBlocks,
    error,
    isError,
  } = useBlockList({
    params: {
      page: 0,
      limit: blockListSize,
    },
    enabled: !!stats?.height,
    placeholderData: keepPreviousData,
  })

  const isLoading = isLoadingStats || isLoadingBlocks

  if (isLoading || !stats || !stats?.height || !blocks) {
    return <LoadingCards length={blockListSize} />
  }

  if (isError) {
    return <ContentError error={error} />
  }

  return (
    <Stack spacing={4}>
      {blocks.blocks.map((block, i) => (
        <BlockCard key={i} block={block} compact />
      ))}
      <Button as={RouterLink} to={generatePath(RoutePath.BlocksList)} bgColor='accent1' color={'white'}>
        <Trans i18nKey='stats.view_all_blocks'>View all blocks</Trans>
      </Button>
    </Stack>
  )
}
