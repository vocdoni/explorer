import { Button, Checkbox, Flex } from '@chakra-ui/react'
import { IElectionListFilter } from '@vocdoni/sdk'
import { Trans, useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { RoutedPagination } from '~components/Pagination/Pagination'
import { RoutedPaginationProvider } from '~components/Pagination/PaginationProvider'
import { PaginationItemsPerPage, RoutePath } from '~constants'
import { useProcessesCount, useProcessList } from '~queries/processes'
import { InputSearch } from '~src/layout/Inputs'
import { LoadingCards } from '~src/layout/Loading'
import LoadingError from '~src/layout/LoadingError'
import useQueryParams from '~src/router/use-query-params'
import { isEmpty } from '~utils/objects'
import { ElectionCard } from './Card'

type FilterQueryParams = {
  [K in keyof Omit<IElectionListFilter, 'organizationId'>]: string
}

export const ProcessSearchBox = () => {
  const { t } = useTranslation()
  const { queryParams, setQueryParams } = useQueryParams<FilterQueryParams>()

  return (
    <Flex direction={{ base: 'column', lg: 'row' }} align={'center'} justify={'end'} gap={4}>
      <Checkbox
        onChange={(e) => setQueryParams({ ...queryParams, withResults: e.target.checked ? 'true' : undefined })}
      >
        <Trans i18nKey='process.show_with_results'>Show only processes with results</Trans>
      </Checkbox>
      <Flex justify='flex-end'>
        <InputSearch
          maxW={'300px'}
          placeholder={t('process.search_by')}
          onChange={(value: string) => {
            setQueryParams({ ...queryParams, electionId: value })
          }}
          debounceTime={500}
        />
      </Flex>
    </Flex>
  )
}

export const ProcessByTypeFilter = () => {
  const { t } = useTranslation()
  const { queryParams, setQueryParams } = useQueryParams<FilterQueryParams>()

  const processStatusFilters = [
    {
      label: t('process.by_status_all'),
      value: undefined,
    },
    {
      label: t('process.by_status_all_active'),
      value: 'READY',
    },
    {
      label: t('process.by_status_paused'),
      value: 'PAUSED',
    },
    {
      label: t('process.by_status_ended'),
      value: 'ENDED',
    },
  ]

  return (
    <Flex align={'center'} justify={'center'} gap={4} wrap={'wrap'}>
      {processStatusFilters.map((filter, i) => (
        <Button
          flex={{ base: 'none', md: '1' }}
          key={i}
          onClick={() => setQueryParams({ ...queryParams, status: filter.value })}
        >
          {filter.label}
        </Button>
      ))}
    </Flex>
  )
}

export const PaginatedProcessList = () => {
  const { page }: { page?: number } = useParams()
  const { data: processCount, isLoading: isLoadingCount } = useProcessesCount()
  const count = processCount || 0
  const { queryParams: processFilters } = useQueryParams<FilterQueryParams>()

  // If no filters applied we can calculate the total pages using process total count
  let totalPages: number | undefined = undefined
  if (isEmpty(processFilters)) {
    totalPages = Math.ceil(count / PaginationItemsPerPage)
  }

  const {
    data: processes,
    isLoading: isLoadingOrgs,
    isError,
    error,
  } = useProcessList({
    page: Number(page || 0),
    filters: {
      electionId: processFilters.electionId,
      // organizationId: processFilters.electionId,
      status: processFilters.status as IElectionListFilter['status'],
      withResults: processFilters.withResults ? processFilters.withResults === 'true' : undefined,
    },
  })

  const isLoading = isLoadingCount || isLoadingOrgs

  if (isLoading) {
    return <LoadingCards />
  }

  if (!processes || processes?.elections.length === 0 || isError) {
    return <LoadingError error={error} />
  }

  return (
    <RoutedPaginationProvider totalPages={totalPages} path={RoutePath.ProcessesList}>
      {processes?.elections.map((election, i) => <ElectionCard key={i} id={election.id} election={election} />)}
      <RoutedPagination />
    </RoutedPaginationProvider>
  )
}
