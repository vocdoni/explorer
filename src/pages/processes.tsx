import ListPageLayout from '~components/Layout/ListPageLayout'
import { useTranslation } from 'react-i18next'
import { useProcessesCount } from '~queries/processes'
import { PaginatedProcessList, ProcessByTypeFilter, ProcessSearchBox } from '~components/Process/ProcessList'
import { RefetchInterval } from '~constants'

const ProcessList = () => {
  const { t } = useTranslation()
  const { data, isLoading } = useProcessesCount({
    refetchInterval: RefetchInterval,
  })

  const subtitle = !isLoading ? t('process.process_count', { count: data || 0 }) : ''

  return (
    <ListPageLayout title={t('process.process_list')} subtitle={subtitle} rightComponent={<ProcessSearchBox />}>
      <ProcessByTypeFilter />
      <PaginatedProcessList />
    </ListPageLayout>
  )
}

export default ProcessList
