import { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { generatePath, useNavigate, useParams } from 'react-router-dom'
import OrganizationCard from '~components/Organizations/Card'
import { RoutedPagination } from '~components/Pagination/Pagination'
import { RoutedPaginationProvider } from '~components/Pagination/PaginationProvider'
import { useOrganizationCount, useOrganizationList } from '~queries/organizations'
import { InputSearch } from '~src/layout/Inputs'
import { LoadingCards } from '~src/layout/Loading'
import LoadingError from '~src/layout/LoadingError'
import { organizationsListPath } from '~src/router'
import { debounce } from '~utils/debounce'

export const OrganizationsFilter = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const debouncedSearch = debounce((value) => {
    navigate(generatePath(organizationsListPath, { page: '1', query: value as string }))
  }, 1000)

  return (
    <InputSearch
      maxW={'300px'}
      placeholder={t('organizations.search_by_org_id')}
      onChange={(event: ChangeEvent<HTMLInputElement>) => {
        debouncedSearch(event.target.value)
      }}
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
  })

  const isLoading = isLoadingCount || isLoadingOrgs

  if (isLoading) {
    return <LoadingCards />
  }

  if (!orgs || orgs?.organizations.length === 0 || isError) {
    return <LoadingError error={error} />
  }

  return (
    <RoutedPaginationProvider totalPages={!query ? Math.ceil(count / 10) : undefined} path={organizationsListPath}>
      {orgs?.organizations.map((org) => (
        <OrganizationCard key={org.organizationID} id={org.organizationID} electionCount={org.electionCount} />
      ))}
      <RoutedPagination />
    </RoutedPaginationProvider>
  )
}
