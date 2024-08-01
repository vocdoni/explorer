import { useChainCosts } from '~queries/stats'
import { useTranslation } from 'react-i18next'
import { StatisticsCardWrapper } from '~components/Stats'
import { IoIosPricetag } from 'react-icons/io'
import { Text, VStack } from '@chakra-ui/react'
import { DetailsGrid } from '~components/Layout/DetailsGrid'

export const ChainCosts = () => {
  const { data, isLoading } = useChainCosts({})
  const { t } = useTranslation()

  return (
    <StatisticsCardWrapper
      icon={IoIosPricetag}
      title={t('stats.price_factors', { defaultValue: 'Price factors' })}
      raw={data}
      readMore={'https://developer.vocdoni.io/vocdoni-api/price-factors-information'}
      isLoading={isLoading}
    >
      <VStack align='stretch'>
        <DetailsGrid
          rowGap={0}
          columnGap={6}
          details={[
            {
              label: t('stats.price_factors.base', { defaultValue: 'Base' }),
              children: data?.basePrice,
              info: t('stats.price_factors.base_info', {
                defaultValue:
                  'Fixed cost that serves as a starting point for the price calculation. It represents the minimal price for creating an election regardless of its size or duration.',
              }),
            },
            {
              label: t('stats.price_factors.capacity', { defaultValue: 'Capacity' }),
              children: data?.capacity,
              info: t('stats.price_factors.capacity_info', {
                defaultValue: 'Capacity of the blockchain',
              }),
            },
          ]}
        />
        <Text fontWeight={'bold'}>{t('stats.price_factors.factors', { defaultValue: 'Factors' })}</Text>
        <DetailsGrid
          rowGap={0}
          columnGap={6}
          details={[
            {
              label: t('stats.price_factors.sizePriceFactor', { defaultValue: 'Size' }),
              children: data?.factors?.k1,
              info: t('stats.price_factors.sizePriceFactor_info', {
                defaultValue:
                  'The size price component is directly proportional to the maximum number of votes allowed in the election',
              }),
            },
            {
              label: t('stats.price_factors.durationPriceFactor', { defaultValue: 'Duration' }),
              children: data?.factors?.k2,
              info: t('stats.price_factors.durationPriceFactor_info', {
                defaultValue:
                  'If the election lasts longer, the price increases, and if there are more votes in a shorter time, the price also increases to reflect the higher demand for resources.',
              }),
            },
            {
              label: t('stats.price_factors.encryptedPriceFactor', { defaultValue: 'Encryption' }),
              children: data?.factors?.k3,
              info: t('stats.price_factors.encryptedPriceFactor_info', {
                defaultValue:
                  'If an election requires encryption for maintaining secrecy until the end (encryptedVotes)',
              }),
            },
            {
              label: t('stats.price_factors.anonymousPriceFactor', { defaultValue: 'Anonymous' }),
              children: data?.factors?.k4,
              info: t('stats.price_factors.anonymousPriceFactor_info', {
                defaultValue: 'If it requires additional measures to ensure voter privacy (anonymousVotes)',
              }),
            },
            {
              label: t('stats.price_factors.overwritePriceFactor', { defaultValue: 'Overwrite' }),
              children: data?.factors?.k5,
              info: t('stats.price_factors.overwritePriceFactor_info', {
                defaultValue:
                  "Is proportional to the maximum number of vote overwrites and the maximum number of votes allowed in the election. It also takes into account the blockchain's capacity to ensure the price reflects the current resource constraints.",
              }),
            },
            {
              label: t('stats.price_factors.sizeScaling', { defaultValue: 'Growth factor' }),
              children: data?.factors?.k6,
              info: t('stats.price_factors.sizeScaling_info', {
                defaultValue:
                  'Rate of price growth for elections with a maximum number of votes (maxCensusSize) exceeding the k7 threshold.',
              }),
            },
            {
              label: t('stats.price_factors.censusSizeScaling', { defaultValue: 'Size trigger' }),
              children: data?.factors?.k7,
              info: t('stats.price_factors.censusSizeScaling_info', {
                defaultValue:
                  'Represents a threshold value for the maximum number of votes (maxCensusSize) in an election. When the election size exceeds k7, the price growth becomes non-linear, increasing more rapidly beyond this point. ',
              }),
            },
          ]}
        />
      </VStack>
    </StatisticsCardWrapper>
  )
}
