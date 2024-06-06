import ListPageLayout from '~src/layout/ListPageLayout'
import { useTranslation } from 'react-i18next'
import { useProcessesCount } from '~queries/processes'
import { PaginatedProcessList, PorcessSearchBox } from '~components/Process/ProcessList'

const ProcessList = () => {
  const { t } = useTranslation()
  const { data, isLoading } = useProcessesCount()

  const subtitle = !isLoading ? t('process.process_count', { count: data || 0 }) : ''

  return (
    <ListPageLayout title={t('process.process_list')} subtitle={subtitle} rightComponent={<PorcessSearchBox />}>
      <PaginatedProcessList />
    </ListPageLayout>
  )
}

export default ProcessList
