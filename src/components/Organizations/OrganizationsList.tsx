import { useTranslation } from 'react-i18next'
import { InputSearch } from '~src/layout/Inputs'
import { useOrganizationCount, useOrganizationList } from '~queries/organizations'
import { generatePath, useNavigate, useParams } from 'react-router-dom'
import OrganizationCard from '~components/Organizations/Card'
import { RoutedPagination } from '~components/Pagination/Pagination'
import { RoutedPaginationProvider, useRoutedPagination } from '~components/Pagination/PaginationProvider'
import { LoadingCards } from '~src/layout/Loading'
import LoadingError from '~src/layout/LoadingError'
import { organizationsListPath } from '~src/router'

export const OrganizationsFilter = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <InputSearch
      maxW={'300px'}
      placeholder={t('organizations.search_by_org_id')}
      onChange={(value: string) => {
        navigate(generatePath(organizationsListPath, { page: '0', query: value as string }))
      }}
      debounceTime={500}
    />
  )
}

export const PaginatedOrganizationsList = () => {
  const { query }: { query?: string } = useParams()
  const { data: orgsCount, isLoading, error, isError } = useOrganizationCount()
  const count = orgsCount?.count || 0

  if (isLoading) {
    return <LoadingCards />
  }

  if (isError) {
    return <LoadingError error={error} />
  }

  return (
    <RoutedPaginationProvider totalPages={!query ? Math.ceil(count / 10) : undefined} path={organizationsListPath}>
      <OrganizationsList />
    </RoutedPaginationProvider>
  )
}

const OrganizationsList = () => {
  const { query }: { query?: string } = useParams()
  const { page } = useRoutedPagination()

  const {
    data: orgs,
    isLoading,
    isError,
    error,
  } = useOrganizationList({
    page: Number(page || 0),
    organizationId: query,
  })

  if (isLoading) {
    return <LoadingCards />
  }

  if (!orgs || orgs?.organizations.length === 0 || isError) {
    return <LoadingError error={error} />
  }

  return (
    <>
      {orgs?.organizations.map((org) => (
        <OrganizationCard key={org.organizationID} id={org.organizationID} electionCount={org.electionCount} />
      ))}
      <RoutedPagination />
    </>
  )
}
