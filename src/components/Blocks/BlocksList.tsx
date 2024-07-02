import { generatePath, useNavigate, useParams } from 'react-router-dom'
import { RoutedPagination } from '~components/Pagination/Pagination'
import { RoutedPaginationProvider } from '~components/Pagination/PaginationProvider'
import { PaginationItemsPerPage, RefreshIntervalBlocks, RoutePath } from '~constants'
import { LoadingCards } from '~components/Layout/Loading'
import LoadingError from '~components/Layout/LoadingError'
import { useBlockList } from '~queries/blocks'
import { useChainInfo } from '~queries/stats'
import { BlockCard } from '~components/Blocks/BlockCard'
import { useTranslation } from 'react-i18next'
import { InputSearch } from '~components/Layout/Inputs'
import { keepPreviousData } from '@tanstack/react-query'

export const BlocksFilter = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data: stats, isLoading: isLoadingStats } = useChainInfo()

  const blockCount = stats?.height || 0

  return (
    <InputSearch
      maxW={'300px'}
      placeholder={t('blocks.search_block')}
      onChange={(value: string) => {
        if (!blockCount) {
          return
        }
        const num = parseInt(value)
        let page = 0 // By default return to first page
        if (!isNaN(num) && num >= 0) {
          page = Math.ceil((blockCount - num + 1) / PaginationItemsPerPage)
        }
        navigate(generatePath(RoutePath.BlocksList, { page: page.toString() }))
      }}
      debounceTime={500}
      type={'number'}
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
  const firstPageIndex = count - currentPage * PaginationItemsPerPage

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
  })

  const isLoading = isLoadingStats || isLoadingBlocks

  if (isLoading) {
    return <LoadingCards />
  }

  if (!blocks || blocks?.length === 0 || isError) {
    return <LoadingError error={error} />
  }

  return (
    <RoutedPaginationProvider totalPages={totalPages} path={RoutePath.BlocksList}>
      {blocks.map((block, i) => (
        <BlockCard
          key={i}
          height={block.header.height}
          time={block.header.time}
          proposer={block.header.proposerAddress}
        />
      ))}
      <RoutedPagination />
    </RoutedPaginationProvider>
  )
}
