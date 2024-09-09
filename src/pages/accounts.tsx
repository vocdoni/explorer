import { RoutedPaginationProvider } from '@vocdoni/react-providers'
import { useTranslation } from 'react-i18next'
import { AccountsFilter, AccountsList } from '~components/Accounts/List'
import ListPageLayout from '~components/Layout/ListPageLayout'
import { RefreshIntervalPagination, RoutePath } from '~constants'
import { useOrganizationCount } from '~queries/accounts'

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
