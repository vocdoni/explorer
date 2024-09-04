import { PaginationResponse } from '@vocdoni/sdk'
import { PropsWithChildren, useMemo } from 'react'
import { ContentError, NoResultsError } from '~components/Layout/ContentError'
import { LoadingCards, SkeletonCardsProps } from '~components/Layout/Loading'
import { Pagination } from '~components/Pagination/Pagination'
import { RoutedPagination } from '~components/Pagination/RoutedPagination'

type AsyncListPaginationProps = {
  pagination?: Pick<PaginationResponse, 'pagination'>['pagination']
  routedPagination?: boolean
  isLoading?: boolean
  skeletonProps?: SkeletonCardsProps
}

type AsyncListLayoutProps<T> = {
  elements?: T[] | null | undefined
  isError?: boolean
  error?: Error | null
  noResultsMsg?: string
} & PropsWithChildren

export const ListDataDisplay = <T,>({ elements, isError, error, noResultsMsg, children }: AsyncListLayoutProps<T>) => {
  if (isError) {
    return <ContentError error={error} />
  }

  if (!elements?.length) {
    return <NoResultsError msg={noResultsMsg} />
  }

  return <>{children}</>
}

export const PaginatedAsyncList = <T,>({
  component: Component,
  elements,
  pagination,
  routedPagination = true,
  isLoading,
  skeletonProps,
  ...rest
}: {
  elements: T[] | null | undefined
  component: React.ComponentType<{ element: T; index: number }>
} & AsyncListLayoutProps<T> &
  AsyncListPaginationProps) => {
  if (isLoading) {
    return <LoadingCards spacing={4} {...skeletonProps} />
  }

  const memoizedComponents = useMemo(
    () => elements?.map((element, index) => <Component key={index} element={element} index={index} />),
    [elements]
  )

  return (
    <ListDataDisplay elements={elements} {...rest}>
      {memoizedComponents}
      {pagination && routedPagination && <RoutedPagination pagination={pagination} />}
      {pagination && !routedPagination && <Pagination pagination={pagination} />}
    </ListDataDisplay>
  )
}
