import { keepPreviousData } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { generatePath, useNavigate, useParams } from 'react-router-dom'
import { InputSearch } from '~components/Layout/Inputs'
import { LoadingCards } from '~components/Layout/Loading'
import { AccountCard } from '~components/Accounts/Card'
import { useRoutedPagination } from '~components/Pagination/PaginationProvider'
import { RoutedPagination } from '~components/Pagination/RoutedPagination'
import { RoutePath } from '~constants'
import { useOrganizationCount, useOrganizationList } from '~queries/accounts'
import { ContentError, NoResultsError } from '~components/Layout/ContentError'
import useQueryParams from '~src/router/use-query-params'

type FilterQueryParams = {
  accountId?: string
}

export const AccountsFilter = () => {
  const { t } = useTranslation()
  const { queryParams, getNewParams } = useQueryParams<FilterQueryParams>()
  const { setPage } = useRoutedPagination()
  const setFilters = (filters: Partial<FilterQueryParams>) => {
    setPage(1, `?${getNewParams(filters).toString()}`)
  }

  return (
    <InputSearch
      maxW={'300px'}
      placeholder={t('accounts.search_by_org_id')}
      onChange={(value: string) => {
        setFilters({ accountId: value })
      }}
      debounceTime={500}
      initialValue={queryParams.accountId}
    />
  )
}

export const AccountsList = () => {
  const { page }: { page?: number } = useRoutedPagination()
  const { queryParams } = useQueryParams<FilterQueryParams>()
  const accountId = queryParams.accountId

  const {
    data: orgs,
    isLoading,
    isFetching,
    isError,
    error,
  } = useOrganizationList({
    params: {
      page,
      organizationId: accountId,
    },
    placeholderData: keepPreviousData,
  })

  if (isLoading || (accountId && isFetching)) {
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
      {orgs?.organizations.map((org, i) => (
        <AccountCard key={i} id={org.organizationID} electionCount={org.electionCount} />
      ))}
      <RoutedPagination pagination={orgs.pagination} />
    </>
  )
}
