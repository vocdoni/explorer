import { useChainCosts, useTxsCosts } from '~queries/stats'
import { useTranslation } from 'react-i18next'
import { Icons } from '~src/theme/components/Icons'
import { DetailsGrid, GridItemProps } from '~components/Layout/DetailsGrid'
import { StatsModalWrapper } from '~components/Stats/StatsCardWrapper'

export const TxCostsModal = () => {
  const { t } = useTranslation()
  const { data, isLoading, isError, error } = useTxsCosts({})

  return (
    <>
      <StatsModalWrapper
        title={t('stats.voc_tokens', { defaultValue: 'VOC Tokens' })}
        icon={Icons.TxIcon}
        isError={isError}
        error={error}
        isLoading={isLoading}
        raw={data}
      >
        <TxCosts />
      </StatsModalWrapper>
    </>
  )
}

const TxCosts = () => {
  const { data } = useTxsCosts({})

  const { t } = useTranslation()

  const prices: GridItemProps[] = []

  if (data?.costs) {
    Object.entries(data.costs).forEach(([key, value]) => {
      prices.push({
        label: key,
        children: value,
        isNumber: true,
      })
    })
  }

  return (
    // <StatsCardWrapper
    //   icon={Icons.TxIcon}
    //   title={t('stats.voc_tokens', { defaultValue: 'VOC Tokens' })}
    //   raw={txCosts}
    //   isLoading={isLoading}
    //   rightComp={<PriceFactorsModal />}
    //   isError={isError}
    //   error={error}
    // >
    <DetailsGrid rowGap={0} columnGap={6} details={prices} />
    // </StatsCardWrapper>
  )
}
