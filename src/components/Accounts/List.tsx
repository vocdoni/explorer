import { keepPreviousData } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { AccountCard } from '~components/Accounts/Card'
import { ContentError, NoResultsError } from '~components/Layout/ContentError'
import { InputSearch } from '~components/Layout/Inputs'
import { LoadingCards } from '~components/Layout/Loading'
import { useRoutedPagination } from '~components/Pagination/PaginationProvider'
import { RoutedPagination } from '~components/Pagination/RoutedPagination'
import { useOrganizationList } from '~queries/accounts'
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

const whitelist = [
  'f82f1c5f48a4751b65c5c69a7de85f337b82b2d6',
  'a52f5588f7bb9f3c6d6b7cf003a5b03f4589edea',
  '1259afa8e3e1c6526b4b9cad75eb07e2c231cc65',
  '2b142d1a8e95a2c7b02a795df4f9a1d18ee51215',
  '63ca71be6765bc582f254eb1c49cf9739bbf798e',
  '5fb10cc1027db85859b89153e55f3e3899d76e79',
  '11f1f8992def6a59ffdfb9bda639dc309a7c289c',
  '8fc30a4c3d11b3b866947c29e4a5525d71f1ff33',
  'a79bf878a219a469c45917b866afc9d681df736f',
]

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
      limit: 200,
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
      {orgs?.organizations.map(
        (org, i) =>
          whitelist.includes(org.organizationID) && (
            <AccountCard key={i} id={org.organizationID} electionCount={org.electionCount} />
          )
      )}
      <RoutedPagination pagination={orgs.pagination} />
    </>
  )
}
