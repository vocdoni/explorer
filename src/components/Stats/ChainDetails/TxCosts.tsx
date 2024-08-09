import { useChainCosts, useTxsCosts } from '~queries/stats'
import { useTranslation } from 'react-i18next'
import { StatisticsCardWrapper } from '~components/Stats'
import { Icons } from '~src/theme/components/Icons'
import { DetailsGrid, GridItemProps } from '~components/Layout/DetailsGrid'
import { PriceFactorsModal } from '~components/Stats/ChainDetails/PriceFactors'

export const TxCosts = () => {
  const { data: txCosts, isLoading: isLoadingTxCosts } = useTxsCosts({})
  const { data: chainCosts, isLoading: isLodingChainCosts } = useChainCosts({})

  const { t } = useTranslation()

  const isLoading = isLoadingTxCosts || isLodingChainCosts

  const prices: GridItemProps[] = [
    {
      label: t('stats.price_factors.base', { defaultValue: 'Base' }),
      children: chainCosts?.basePrice,
      isNumber: true,
    },
  ]
  if (txCosts?.costs) {
    Object.entries(txCosts.costs).forEach(([key, value]) => {
      prices.push({
        label: key,
        children: value,
        isNumber: true,
      })
    })
  }

  return (
    <StatisticsCardWrapper
      icon={Icons.TxIcon}
      title={t('stats.voc_tokens', { defaultValue: 'VOC Tokens' })}
      raw={txCosts}
      isLoading={isLoading}
      rightComp={<PriceFactorsModal />}
    >
      <DetailsGrid rowGap={0} columnGap={6} details={prices} />
    </StatisticsCardWrapper>
  )
}
