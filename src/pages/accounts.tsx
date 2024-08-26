import { AccountsFilter, AccountsList } from '~components/Accounts/List'
import ListPageLayout from '~components/Layout/ListPageLayout'
import { useOrganizationCount } from '~queries/accounts'
import { useTranslation } from 'react-i18next'
import { RefreshIntervalPagination, RoutePath } from '~constants'
import { RoutedPaginationProvider } from '~components/Pagination/PaginationProvider'

const OrganizationList = () => {
  const { t } = useTranslation()
  const { data: orgsCount, isLoading } = useOrganizationCount({
    refetchInterval: RefreshIntervalPagination,
  })

  const subtitle = !isLoading ? t('accounts.accounts_count', { count: orgsCount || 0 }) : ''

  return (
    <RoutedPaginationProvider path={RoutePath.AccountsList}>
      <ListPageLayout title={t('accounts.accounts_list')} subtitle={subtitle} rightComponent={<AccountsFilter />}>
        <AccountsList />
      </ListPageLayout>
    </RoutedPaginationProvider>
  )
}

export default OrganizationList
