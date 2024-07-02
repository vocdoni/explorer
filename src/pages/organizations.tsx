import { OrganizationsFilter, PaginatedOrganizationsList } from '~components/Organizations/List'
import ListPageLayout from '~components/Layout/ListPageLayout'
import { useOrganizationCount } from '~queries/organizations'
import { useTranslation } from 'react-i18next'
import { RefetchInterval } from '~constants'

const OrganizationList = () => {
  const { t } = useTranslation()
  const { data: orgsCount, isLoading } = useOrganizationCount({
    refetchInterval: RefetchInterval,
  })

  const subtitle = !isLoading ? t('organizations.organizations_count', { count: orgsCount?.count || 0 }) : ''

  return (
    <ListPageLayout
      title={t('organizations.organizations_list')}
      subtitle={subtitle}
      rightComponent={<OrganizationsFilter />}
    >
      <PaginatedOrganizationsList />
    </ListPageLayout>
  )
}

export default OrganizationList
