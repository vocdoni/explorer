import { OrganizationsFilter, OrganizationsList } from '~components/Organizations/OrganizationsList'
import ListPageLayout from '~src/layout/ListPageLayout'
import { useOrganizationCount } from '~queries/organizations'
import { useTranslation } from 'react-i18next'

const OrganizationList = () => {
  const { t } = useTranslation()
  const { data: orgsCount, isLoading, error: countError } = useOrganizationCount()

  const subtitle = !isLoading ? t('organizations.organizations_count', { count: orgsCount?.count || 0 }) : ''

  return (
    <ListPageLayout
      title={t('organizations.organizations_list')}
      subtitle={subtitle}
      rightComponent={<OrganizationsFilter />}
    >
      <OrganizationsList />
    </ListPageLayout>
  )
}

export default OrganizationList
