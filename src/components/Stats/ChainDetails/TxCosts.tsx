import { useTxsCosts } from '~queries/stats'
import { useTranslation } from 'react-i18next'
import { StatisticsCardWrapper } from '~components/Stats'
import { Icons } from '~src/theme/components/Icons'
import { DetailsGrid, GridItemProps } from '~components/Layout/DetailsGrid'

export const TxCosts = () => {
  const { data, isLoading } = useTxsCosts({})
  const { t } = useTranslation()

  let prices: GridItemProps[] = []
  if (data?.costs) {
    prices = Object.entries(data.costs).map(([key, value]) => {
      return {
        label: key,
        children: value,
      }
    })
  }

  return (
    <StatisticsCardWrapper
      icon={Icons.TxIcon}
      title={t('stats.tx_costs', { defaultValue: 'Transactions Costs' })}
      raw={data}
      isLoading={isLoading}
    >
      <DetailsGrid rowGap={0} columnGap={6} details={prices} />
    </StatisticsCardWrapper>
  )
}
