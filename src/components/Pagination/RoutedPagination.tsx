import { useBreakpointValue } from '@chakra-ui/react'
// import { RoutedPagination as Pagination, PaginationProps } from './Pagination'
import { RoutedPagination as Pagination, PaginationProps } from '@vocdoni/chakra-components'

// Note this component is a custom definition of the pagination component that will end in chakra-components
export const RoutedPagination = (props: PaginationProps) => {
  const maxButtons = useBreakpointValue({ base: 6, lg: 10 })

  return <Pagination {...props} maxButtons={maxButtons} />
}
