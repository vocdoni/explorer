import { useBreakpointValue } from '@chakra-ui/react'
import { RoutedPagination as CRoutedPagination, Pagination, PaginationProps } from '@vocdoni/chakra-components'
import { PaginationResponse } from '@vocdoni/sdk'

export type AsyncListPaginationProps = {
  pagination?: Pick<PaginationResponse, 'pagination'>['pagination']
  routedPagination?: boolean
}

export const PaginatorSelector = ({ routedPagination = true, pagination }: AsyncListPaginationProps) => {
  if (!pagination) return null
  if (routedPagination) return <RoutedPagination pagination={pagination} />
  return <Pagination pagination={pagination} />
}

export const RoutedPagination = (props: PaginationProps) => {
  const maxButtons = useBreakpointValue({ base: 6, lg: 10 })

  return <CRoutedPagination {...props} maxButtons={maxButtons} />
}
