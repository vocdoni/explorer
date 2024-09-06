import { useTranslation } from 'react-i18next'
import { DetailsGrid, GridItemProps } from '~components/Layout/DetailsGrid'
import { StatsModalWrapper } from '~components/Stats/StatsCardWrapper'
import { useTxsCosts } from '~queries/stats'
import { Icons } from '~src/theme/components/Icons'

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

  return <DetailsGrid rowGap={0} columnGap={6} details={prices} />
}
