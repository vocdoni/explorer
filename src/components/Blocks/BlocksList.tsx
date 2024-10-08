import { keepPreviousData } from '@tanstack/react-query'
import { RoutedPaginationProvider, useRoutedPagination } from '@vocdoni/react-providers'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { generatePath, useNavigate } from 'react-router-dom'
import { BlockCard } from '~components/Blocks/BlockCard'
import { PaginatedAsyncList } from '~components/Layout/AsyncList'
import { PopoverInputSearch } from '~components/Layout/Inputs'
import { PaginationItemsPerPage, RefreshIntervalBlocks, RoutePath } from '~constants'
import { useBlockList } from '~queries/blocks'
import { useChainInfo } from '~queries/stats'

export const BlocksFilter = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [blockHeight, setBlockHeight] = useState('')
  const { data: stats } = useChainInfo()

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
  }, [blockHeight, blockCount, navigate, t])

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

  const {
    data,
    isLoading: isLoadingBlocks,
    isError,
    error,
  } = useBlockList({
    params: {
      page: page,
      limit: PaginationItemsPerPage,
    },
    enabled: !!stats?.height,
    placeholderData: keepPreviousData,
  })

  return (
    <PaginatedAsyncList
      isLoading={isLoadingStats || isLoadingBlocks}
      elements={data?.blocks}
      isError={isError}
      error={error}
      pagination={data?.pagination}
      component={({ element }) => <BlockCard block={element} />}
      skeletonProps={{ noOfLines: 2 }}
    />
  )
}
