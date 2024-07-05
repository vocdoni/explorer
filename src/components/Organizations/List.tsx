import { keepPreviousData } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { generatePath, useNavigate, useParams } from 'react-router-dom'
import { InputSearch } from '~components/Layout/Inputs'
import { LoadingCards } from '~components/Layout/Loading'
import LoadingError from '~components/Layout/LoadingError'
import { OrganizationCard } from '~components/Organizations/Card'
import { RoutedPaginationProvider } from '~components/Pagination/PaginationProvider'
import { RoutedPagination } from '~components/Pagination/RoutedPagination'
import { PaginationItemsPerPage, RoutePath } from '~constants'
import { useOrganizationCount, useOrganizationList } from '~queries/organizations'
import { retryUnlessNotFound } from '~utils/queries'

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
  const { page, query }: { page?: number; query?: string } = useParams()
  const { data: orgsCount, isLoading: isLoadingCount } = useOrganizationCount()
  const count = orgsCount?.count || 0

  const {
    data: orgs,
    isLoading: isLoadingOrgs,
    isFetching,
    isError,
    error,
  } = useOrganizationList({
    page: Number(page || 1),
    organizationId: query,
    placeholderData: keepPreviousData,
    retry: retryUnlessNotFound,
  })

  const isLoading = isLoadingCount || isLoadingOrgs

  if (isLoading || (query && isFetching)) {
    return <LoadingCards />
  }

  if (!orgs || orgs?.organizations.length === 0 || isError) {
    return <LoadingError error={error} />
  }

  return (
    <RoutedPaginationProvider
      totalPages={!query ? Math.ceil(count / PaginationItemsPerPage) : undefined}
      path={RoutePath.OrganizationsList}
    >
      {orgs?.organizations.map((org) => (
        <OrganizationCard key={org.organizationID} id={org.organizationID} electionCount={org.electionCount} />
      ))}
      <RoutedPagination />
    </RoutedPaginationProvider>
  )
}
