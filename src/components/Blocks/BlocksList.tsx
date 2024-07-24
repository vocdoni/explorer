import { keepPreviousData } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { generatePath, useNavigate, useParams } from 'react-router-dom'
import { BlockCard } from '~components/Blocks/BlockCard'
import { PopoverInputSearch } from '~components/Layout/Inputs'
import { LoadingCards } from '~components/Layout/Loading'
import LoadingError from '~components/Layout/LoadingError'
import { RoutedPaginationProvider } from '~components/Pagination/PaginationProvider'
import { RoutedPagination } from '~components/Pagination/RoutedPagination'
import { PaginationItemsPerPage, RefreshIntervalBlocks, RoutePath } from '~constants'
import { useBlockList } from '~queries/blocks'
import { useChainInfo } from '~queries/stats'
import { retryUnlessNotFound } from '~utils/queries'

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
    navigate(generatePath(RoutePath.Block, { height: num.toString(), page: null }))
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
  const { page }: { page?: number } = useParams()
  const { data: stats, isLoading: isLoadingStats } = useChainInfo({
    refetchInterval: RefreshIntervalBlocks,
  })

  const count = stats?.height || 0
  const totalPages = Math.ceil(count / PaginationItemsPerPage)

  // Calculate the first block index for the current page
  const currentPage = page && page > 0 ? Number(page - 1) : 0
  // Get the first block of the page
  const firstPageIndex = count - currentPage * PaginationItemsPerPage + 1

  const {
    data: blocks,
    isLoading: isLoadingBlocks,
    isError,
    error,
  } = useBlockList({
    enabled: !!stats?.height,
    from: firstPageIndex < 0 ? 0 : firstPageIndex - PaginationItemsPerPage,
    listSize: PaginationItemsPerPage,
    placeholderData: keepPreviousData,
    retry: retryUnlessNotFound,
  })

  const isLoading = isLoadingStats || isLoadingBlocks

  if (isLoading) {
    return <LoadingCards noOfLines={2} />
  }

  if (!blocks || blocks?.length === 0 || isError) {
    return <LoadingError error={error} />
  }

  return (
    <RoutedPaginationProvider totalPages={totalPages} path={RoutePath.BlocksList}>
      {blocks.map((block, i) => (
        <BlockCard key={i} block={block} />
      ))}
      <RoutedPagination />
    </RoutedPaginationProvider>
  )
}
