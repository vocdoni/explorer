import { RoutedPaginationProvider } from '@vocdoni/react-providers'
import { useTranslation } from 'react-i18next'
import ListPageLayout from '~components/Layout/ListPageLayout'
import {
  ProcessList as PaginatedProcessList,
  ProcessByTypeFilter,
  ProcessSearchBox,
} from '~components/Process/ProcessList'
import { RefreshIntervalPagination, RoutePath } from '~constants'
import { useProcessesCount } from '~queries/processes'

const ProcessList = () => {
  const { t } = useTranslation()
  const { data, isLoading } = useProcessesCount({
    refetchInterval: RefreshIntervalPagination,
  })

  const subtitle = !isLoading ? t('process.process_count', { count: data || 0 }) : ''

  return (
    <RoutedPaginationProvider path={RoutePath.ProcessesList}>
      <ListPageLayout title={t('process.process_list')} subtitle={subtitle} rightComponent={<ProcessSearchBox />}>
        <ProcessByTypeFilter />
        <PaginatedProcessList />
      </ListPageLayout>
    </RoutedPaginationProvider>
  )
}

export default ProcessList
