import { keepPreviousData } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { generatePath, useNavigate } from 'react-router-dom'
import { BlockCard } from '~components/Blocks/BlockCard'
import { PopoverInputSearch } from '~components/Layout/Inputs'
import { LoadingCards } from '~components/Layout/Loading'
import { ContentError, NoResultsError } from '~components/Layout/ContentError'
import { RoutedPaginationProvider, useRoutedPagination } from '~components/Pagination/PaginationProvider'
import { RoutedPagination } from '~components/Pagination/RoutedPagination'
import { PaginationItemsPerPage, RefreshIntervalBlocks, RoutePath } from '~constants'
import { useBlockList } from '~queries/blocks'
import { useChainInfo } from '~queries/stats'

export const BlocksFilter = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [blockHeight, setBlockHeight] = useState('')
  const { data: stats, isLoading: isLoadingStats } = useChainInfo()

  const blockCount = stats?.height || 0

  const goTo = useCallback(() => {
    const num = parseInt(blockHeight)
    if (!blockCount) {
      throw new Error(t('blocks.invalid_chain_height', { defaultValue: 'Invalid chain block height' }))
    }
    if (isNaN(num) || num <= 0 || num > blockCount) {
      throw new Error(t('blocks.invalid_block_search', { defaultValue: 'Must to be a valid block height' }))
    }
    navigate(generatePath(RoutePath.Block, { height: num.toString(), tab: null, page: null }))
  }, [blockHeight, blockCount])

  return (
    <PopoverInputSearch
      input={{
        placeholder: t('blocks.go_to_block', { defaultValue: 'Go to block' }),
        onChange: (value: string) => {
          setBlockHeight(value)
        },
      }}
      button={{
        onClick: goTo,
      }}
    />
  )
}

export const PaginatedBlocksList = () => {
  return (
    <RoutedPaginationProvider path={RoutePath.BlocksList}>
      <BlocksList />
    </RoutedPaginationProvider>
  )
}

export const BlocksList = () => {
  const { page }: { page?: number } = useRoutedPagination()
  const { data: stats, isLoading: isLoadingStats } = useChainInfo({
    refetchInterval: RefreshIntervalBlocks,
  })

  const blockCount = stats?.height || 0

  const {
    data: blocksResponse,
    isLoading: isLoadingBlocks,
    isError,
    error,
  } = useBlockList({
    params: {
      totalItems: blockCount,
      page: page,
      limit: PaginationItemsPerPage,
    },
    enabled: !!stats?.height,
    placeholderData: keepPreviousData,
  })

  const isLoading = isLoadingStats || isLoadingBlocks

  if (isLoading) {
    return <LoadingCards noOfLines={2} />
  }

  const blocks = blocksResponse?.blocks

  if (blocksResponse?.pagination.totalItems === 0) {
    return <NoResultsError />
  }

  if (isError || !blocks) {
    return <ContentError error={error} />
  }

  return (
    <>
      {blocks.map((block, i) => (
        <BlockCard key={i} block={block} />
      ))}
      <RoutedPagination pagination={blocksResponse.pagination} />
    </>
  )
}
