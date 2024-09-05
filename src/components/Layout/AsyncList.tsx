import { Box, Table, TableContainer, Tbody } from '@chakra-ui/react'
import { PaginationResponse } from '@vocdoni/sdk'
import { PropsWithChildren, ReactNode, useMemo } from 'react'
import { ContentError, NoResultsError } from '~components/Layout/ContentError'
import { LoadingCards, SkeletonCardsProps } from '~components/Layout/Loading'
import { Pagination } from '~components/Pagination/Pagination'
import { RoutedPagination } from '~components/Pagination/RoutedPagination'

type AsyncListPaginationProps = {
  pagination?: Pick<PaginationResponse, 'pagination'>['pagination']
  routedPagination?: boolean
}

type AsyncListLayoutProps<T> = {
  elements?: T[] | null | undefined
  isError?: boolean
  error?: Error | null
  noResultsMsg?: string
  skeletonProps?: SkeletonCardsProps
  isLoading?: boolean
} & PropsWithChildren

const PaginatorSelector = ({ routedPagination = true, pagination }: AsyncListPaginationProps) => {
  if (!pagination) return null
  if (routedPagination) return <RoutedPagination pagination={pagination} />
  return <Pagination pagination={pagination} />
}

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
      <PaginatorSelector routedPagination={routedPagination} pagination={pagination} />
    </ListDataDisplay>
  )
}

export const PaginatedAsyncTable = <T,>({
  th,
  component: Component,
  elements,
  pagination,
  routedPagination = true,
  isLoading,
  skeletonProps,
  ...rest
}: {
  th: ReactNode
  elements: T[] | null | undefined
  component: React.ComponentType<{ element: T; index: number }>
} & AsyncListLayoutProps<T> &
  AsyncListPaginationProps) => {
  const memoizedComponents = useMemo(
    () => elements?.map((element, index) => <Component key={index} element={element} index={index} />),
    [elements]
  )

  return (
    <ListDataDisplay elements={elements} {...rest}>
      <Box overflow='auto' w='auto' pb={4}>
        <TableContainer>
          <Table>
            {th}
            <Tbody>{memoizedComponents}</Tbody>
          </Table>
        </TableContainer>
      </Box>
      {!isLoading && <PaginatorSelector routedPagination={routedPagination} pagination={pagination} />}
    </ListDataDisplay>
  )
}
