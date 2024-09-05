import { keepPreviousData } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { InputSearch } from '~components/Layout/Inputs'
import { AccountCard } from '~components/Accounts/Card'
import { useRoutedPagination } from '~components/Pagination/PaginationProvider'
import { useOrganizationList } from '~queries/accounts'
import { useRoutedPaginationQueryParams } from '~src/router/use-query-params'
import { PaginatedAsyncList } from '~components/Layout/AsyncList'

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

  const { data, isLoading, isFetching, isError, error } = useOrganizationList({
    params: {
      page,
      organizationId: accountId,
    },
    placeholderData: keepPreviousData,
  })

  return (
    <PaginatedAsyncList
      isLoading={isLoading || (!!accountId && isFetching)}
      elements={data?.organizations}
      isError={isError}
      error={error}
      pagination={data?.pagination}
      component={({ element }) => <AccountCard id={element.organizationID} electionCount={element.electionCount} />}
      skeletonProps={{ skeletonCircle: true }}
    />
  )
}
