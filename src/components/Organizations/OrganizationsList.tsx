import { InputSearch } from '~src/layout/Inputs'
import { useOrganizationCount, useOrganizationList } from '~queries/organizations'
import { debounce } from '~utils/debounce'
import { generatePath, useNavigate, useParams } from 'react-router-dom'
import { RoutedPaginationProvider } from '~components/Pagination/PaginationProvider'
import OrganizationCard from '~components/Organizations/Card'
import { RoutedPagination } from '~components/Pagination/Pagination'
import LoadingError from '~src/layout/LoadingError'
import { useTranslation } from 'react-i18next'
import { ORGANIZATIONS_LIST_PATH } from '~src/router'
import { LoadingCards } from '~src/layout/Loading'

export const OrganizationsFilter = () => {
  const { t } = useTranslation()
  const { page, orgId }: { page?: number; orgId?: string } = useParams()
  const navigate = useNavigate()

  const debouncedSearch = debounce((value) => {
    const getPath = () => {
      // If previous state has not org id, ensure to look at the first page
      if (!orgId || orgId.length === 0) {
        return generatePath(ORGANIZATIONS_LIST_PATH, { page: '0', query: value as string })
      }
      return generatePath(ORGANIZATIONS_LIST_PATH, { page: page?.toString() || '0', query: value as string })
    }
    navigate(getPath())
  }, 1000)

  const searchOnChange = (event: any) => {
    debouncedSearch(event.target.value)
  }

  return <InputSearch maxW={'300px'} placeholder={t('organizations.search_by_org_id')} onChange={searchOnChange} />
}

export const PaginatedOrganizationsList = () => {
  const { page, orgId }: { page?: number; orgId?: string } = useParams()
  const { data: orgsCount, isLoading: isLoadingCount } = useOrganizationCount()
  const count = orgsCount?.count || 0

  const {
    data: orgs,
    isLoading: isLoadingOrgs,
    isError,
    error,
  } = useOrganizationList({
    page: Number(page || 0),
    organizationId: orgId,
  })

  const isLoading = isLoadingCount || isLoadingOrgs

  if (isLoading) {
    return <LoadingCards />
  }

  if (!orgs || orgs?.organizations.length === 0 || isError) {
    return <LoadingError error={error} />
  }

  return (
    <RoutedPaginationProvider totalPages={Math.ceil(count / 10)} path='/organizations/:page?/:orgId?'>
      {orgs?.organizations.map((org) => (
        <OrganizationCard key={org.organizationID} id={org.organizationID} electionCount={org.electionCount} />
      ))}
      <RoutedPagination />
    </RoutedPaginationProvider>
  )
}
