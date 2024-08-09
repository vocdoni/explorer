import { keepPreviousData } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { generatePath, useNavigate, useParams } from 'react-router-dom'
import { InputSearch } from '~components/Layout/Inputs'
import { LoadingCards } from '~components/Layout/Loading'
import { OrganizationCard } from '~components/Organizations/Card'
import { RoutedPaginationProvider, useRoutedPagination } from '~components/Pagination/PaginationProvider'
import { RoutedPagination } from '~components/Pagination/RoutedPagination'
import { RoutePath } from '~constants'
import { useOrganizationCount, useOrganizationList } from '~queries/organizations'
import { ContentError, NoResultsError } from '~components/Layout/ContentError'

export const OrganizationsFilter = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { query } = useParams<{ query?: string }>()

  return (
    <InputSearch
      maxW={'300px'}
      placeholder={t('organizations.search_by_org_id')}
      onChange={(value: string) => {
        navigate(generatePath(RoutePath.OrganizationsList, { page: '0', query: value as string }))
      }}
      debounceTime={500}
      initialValue={query}
    />
  )
}

export const PaginatedOrganizationsList = () => {
  return (
    <RoutedPaginationProvider path={RoutePath.OrganizationsList}>
      <OrganizationsList />
    </RoutedPaginationProvider>
  )
}

export const OrganizationsList = () => {
  const { page }: { page?: number } = useRoutedPagination()
  const { query }: { query?: string } = useParams()
  const { data: count, isLoading: isLoadingCount } = useOrganizationCount()

  const {
    data: orgs,
    isLoading: isLoadingOrgs,
    isFetching,
    isError,
    error,
  } = useOrganizationList({
    params: {
      page,
      organizationId: query,
    },
    placeholderData: keepPreviousData,
  })

  const isLoading = isLoadingCount || isLoadingOrgs

  if (isLoading || (query && isFetching)) {
    return <LoadingCards skeletonCircle />
  }

  if (orgs?.pagination.totalItems === 0) {
    return <NoResultsError />
  }

  if (!orgs || isError) {
    return <ContentError error={error} />
  }

  return (
    <>
      {orgs?.organizations.map((org) => (
        <OrganizationCard key={org.organizationID} id={org.organizationID} electionCount={org.electionCount} />
      ))}
      <RoutedPagination pagination={orgs.pagination} />
    </>
  )
}
