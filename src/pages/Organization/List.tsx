import { OrganizationsFilter, PaginatedOrganizationsList } from '~components/Organizations/OrganizationsList'
import ListPageLayout from '~src/layout/ListPageLayout'
import { useOrganizationCount } from '~queries/organizations'
import { useTranslation } from 'react-i18next'

const OrganizationList = () => {
  const { t } = useTranslation()
  const { data: orgsCount, isLoading } = useOrganizationCount()

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
