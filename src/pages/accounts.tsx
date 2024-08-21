import { AccountsFilter, PaginatedAccountsList } from '~components/Accounts/List'
import ListPageLayout from '~components/Layout/ListPageLayout'
import { useOrganizationCount } from '~queries/accounts'
import { useTranslation } from 'react-i18next'
import { RefreshIntervalPagination } from '~constants'

const OrganizationList = () => {
  const { t } = useTranslation()
  const { data: orgsCount, isLoading } = useOrganizationCount({
    refetchInterval: RefreshIntervalPagination,
  })

  const subtitle = !isLoading ? t('accounts.accounts_count', { count: orgsCount || 0 }) : ''

  return (
    <ListPageLayout title={t('accounts.accounts_list')} subtitle={subtitle} rightComponent={<AccountsFilter />}>
      <PaginatedAccountsList />
    </ListPageLayout>
  )
}

export default OrganizationList
