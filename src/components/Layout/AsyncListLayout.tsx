import { LoadingCards, SkeletonCardsProps } from '~components/Layout/Loading'
import { ContentError, NoResultsError } from '~components/Layout/ContentError'
import { Pagination } from '~components/Pagination/Pagination'
import { RoutedPagination } from '~components/Pagination/RoutedPagination'
import { PaginationResponse } from '@vocdoni/sdk'

type AsyncListLayoutProps<T> = {
  elements: T[] | null | undefined
  isLoading?: boolean
  isError?: boolean
  error?: Error | null
  noResultsMsg?: string
  component: React.ComponentType<{ element: T }>
  pagination?: Pick<PaginationResponse, 'pagination'>['pagination']
  routedPagination?: boolean
  skeletonProps?: SkeletonCardsProps
}

const AsyncListLayout = <T,>({
  elements,
  isLoading,
  isError,
  error,
  noResultsMsg,
  component,
  pagination,
  routedPagination = true,
  skeletonProps,
}: AsyncListLayoutProps<T>) => {
  if (isLoading) {
    return <LoadingCards spacing={4} {...skeletonProps} />
  }

  if (elements && elements.length <= 0) {
    return <NoResultsError msg={noResultsMsg} />
  }

  if (isError || !elements) {
    return <ContentError error={error} />
  }

  const Component = component

  return (
    <>
      {elements.map((element, index) => (
        <Component key={index} element={element} />
      ))}
      {pagination && routedPagination && <RoutedPagination pagination={pagination} />}
      {pagination && !routedPagination && <Pagination pagination={pagination} />}
    </>
  )
}

export default AsyncListLayout
