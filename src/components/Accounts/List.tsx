import { keepPreviousData } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { generatePath, useNavigate, useParams } from 'react-router-dom'
import { InputSearch } from '~components/Layout/Inputs'
import { LoadingCards } from '~components/Layout/Loading'
import { AccountCard } from '~components/Accounts/Card'
import { RoutedPaginationProvider, useRoutedPagination } from '~components/Pagination/PaginationProvider'
import { RoutedPagination } from '~components/Pagination/RoutedPagination'
import { RoutePath } from '~constants'
import { useOrganizationCount, useOrganizationList } from '~queries/accounts'
import { ContentError, NoResultsError } from '~components/Layout/ContentError'

export const AccountsFilter = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { query } = useParams<{ query?: string }>()

  return (
    <InputSearch
      maxW={'300px'}
      placeholder={t('accounts.search_by_org_id')}
      onChange={(value: string) => {
        navigate(generatePath(RoutePath.AccountsList, { page: '1', query: value as string }))
      }}
      debounceTime={500}
      initialValue={query}
    />
  )
}

export const PaginatedAccountsList = () => {
  return (
    <RoutedPaginationProvider path={RoutePath.AccountsList}>
      <AccountsList />
    </RoutedPaginationProvider>
  )
}

export const AccountsList = () => {
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
      {orgs?.organizations.map((org, i) => (
        <AccountCard key={i} id={org.organizationID} electionCount={org.electionCount} />
      ))}
      <RoutedPagination pagination={orgs.pagination} />
    </>
  )
}
