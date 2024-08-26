import { keepPreviousData } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { InputSearch } from '~components/Layout/Inputs'
import { LoadingCards } from '~components/Layout/Loading'
import { AccountCard } from '~components/Accounts/Card'
import { useRoutedPagination } from '~components/Pagination/PaginationProvider'
import { RoutedPagination } from '~components/Pagination/RoutedPagination'
import { useOrganizationList } from '~queries/accounts'
import { ContentError, NoResultsError } from '~components/Layout/ContentError'
import { useRoutedPaginationQueryParams } from '~src/router/use-query-params'

type FilterQueryParams = {
  accountId?: string
}

export const AccountsFilter = () => {
  const { t } = useTranslation()
  const { queryParams, setQueryParams } = useRoutedPaginationQueryParams<FilterQueryParams>()

  return (
    <InputSearch
      maxW={'300px'}
      placeholder={t('accounts.search_by_org_id')}
      onChange={(value: string) => {
        setQueryParams({ accountId: value })
      }}
      debounceTime={500}
      initialValue={queryParams.accountId}
    />
  )
}

export const AccountsList = () => {
  const { page }: { page?: number } = useRoutedPagination()
  const { queryParams } = useRoutedPaginationQueryParams<FilterQueryParams>()
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
