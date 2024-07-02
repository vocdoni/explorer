import { useTranslation } from 'react-i18next'
import { generatePath, useNavigate, useParams } from 'react-router-dom'
import { OrganizationCard } from '~components/Organizations/Card'
import { RoutedPagination } from '~components/Pagination/Pagination'
import { RoutedPaginationProvider } from '~components/Pagination/PaginationProvider'
import { PaginationItemsPerPage, RoutePath } from '~constants'
import { useOrganizationCount, useOrganizationList } from '~queries/organizations'
import { InputSearch } from '~components/Layout/Inputs'
import { LoadingCards } from '~components/Layout/Loading'
import LoadingError from '~components/Layout/LoadingError'
import { keepPreviousData } from '@tanstack/react-query'

export const OrganizationsFilter = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <InputSearch
      maxW={'300px'}
      placeholder={t('organizations.search_by_org_id')}
      onChange={(value: string) => {
        navigate(generatePath(RoutePath.OrganizationsList, { page: '0', query: value as string }))
      }}
      debounceTime={500}
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
    isError,
    error,
  } = useOrganizationList({
    page: Number(page || 1),
    organizationId: query,
    placeholderData: keepPreviousData,
  })

  const isLoading = isLoadingCount || isLoadingOrgs

  if (isLoading) {
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
