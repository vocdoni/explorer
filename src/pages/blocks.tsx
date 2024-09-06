import { useTranslation } from 'react-i18next'
import { BlocksFilter, PaginatedBlocksList } from '~components/Blocks/BlocksList'
import ListPageLayout from '~components/Layout/ListPageLayout'
import { useChainInfo } from '~queries/stats'

const BlocksList = () => {
  const { t } = useTranslation()
  const { data: stats, isLoading: isLoadingStats } = useChainInfo()

  const subtitle = !isLoadingStats && !!stats?.height ? t('blocks.blocks_count', { count: stats.height }) : ''

  return (
    <ListPageLayout title={t('blocks.blocks_list')} subtitle={subtitle} rightComponent={<BlocksFilter />}>
      <PaginatedBlocksList />
    </ListPageLayout>
  )
}

export default BlocksList
