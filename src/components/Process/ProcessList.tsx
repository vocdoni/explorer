import { useParams } from 'react-router-dom'
import { RoutedPaginationProvider } from '~components/Pagination/PaginationProvider'
import { RoutedPagination } from '~components/Pagination/Pagination'
import LoadingError from '~src/layout/LoadingError'
import { LoadingCards } from '~src/layout/Loading'
import { useProcessesCount, useProcessList } from '~queries/processes'
import ElectionCard from './Card'
import { processListPath } from '~src/router'

export const PaginatedProcessList = () => {
  const { page }: { page?: number } = useParams()
  const { data: processCount, isLoading: isLoadingCount } = useProcessesCount()
  const count = processCount || 0

  const {
    data: processes,
    isLoading: isLoadingOrgs,
    isError,
    error,
  } = useProcessList({
    page: Number(page || 0),
    filters: {},
  })

  const isLoading = isLoadingCount || isLoadingOrgs

  if (isLoading) {
    return <LoadingCards />
  }

  if (!processes || processes?.elections.length === 0 || isError) {
    return <LoadingError error={error} />
  }

  return (
    <RoutedPaginationProvider totalPages={Math.ceil(count / 10)} path={processListPath}>
      {processes?.elections.map((election, i) => (
        <ElectionCard key={i} election={election} />
      ))}
      <RoutedPagination />
    </RoutedPaginationProvider>
  )
}
