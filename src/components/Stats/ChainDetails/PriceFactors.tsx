import { Text, VStack } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { IoIosPricetag } from 'react-icons/io'
import { ContentError } from '~components/Layout/ContentError'
import { DetailsGrid } from '~components/Layout/DetailsGrid'
import { StatsModalWrapper } from '~components/Stats/StatsCardWrapper'
import { useChainCosts } from '~queries/stats'

export const PriceFactorsModal = () => {
  const { t } = useTranslation()
  const { data, isError, error, isLoading } = useChainCosts({})

  return (
    <>
      <StatsModalWrapper
        title={t('stats.price_factors.title', { defaultValue: 'Price factors' })}
        icon={IoIosPricetag}
        link={'https://developer.vocdoni.io/vocdoni-api/price-factors-information'}
        isError={isError}
        error={error}
        isLoading={isLoading}
        raw={data}
      >
        <PriceFactorsInfoSkeleton />
      </StatsModalWrapper>
    </>
  )
}

const PriceFactorsInfoSkeleton = () => {
  const { data, isError, error } = useChainCosts({})
  const { t } = useTranslation()

  if (isError) {
    return <ContentError error={error} />
  }

  return (
    <VStack align='stretch'>
      <Text>
        {t('stats.price_factors.info_text', {
          defaultValue:
            'The formula used to calculate an election price takes into account various factors, each reflecting one specific aspect of the election process. ',
        })}
      </Text>
      <DetailsGrid
        rowGap={0}
        columnGap={6}
        templateColumns={{ base: '1fr', sm: '1fr 1fr' }}
        details={[
          {
            label: t('stats.price_factors.base', { defaultValue: 'Base' }),
            children: data?.basePrice,
            info: t('stats.price_factors.base_info', {
              defaultValue:
                'Fixed cost that serves as a starting point for the price calculation. It represents the minimal price for creating an election regardless of its size or duration.',
            }),
            isNumber: true,
          },
          {
            label: t('stats.networkCapacity', { defaultValue: 'Capacity (votes/block)' }),
            children: data?.capacity,
            info: t('stats.price_factors.capacity_info', {
              defaultValue: 'Capacity of the blockchain',
            }),
            isNumber: true,
          },
        ]}
      />
      <Text fontWeight={'bold'}>{t('stats.price_factors.factors', { defaultValue: 'Factors' })}</Text>
      <DetailsGrid
        templateColumns={{ base: '1fr', sm: '1fr 1fr' }}
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
            isNumber: true,
          },
          {
            label: t('stats.price_factors.durationPriceFactor', { defaultValue: 'Duration' }),
            children: data?.factors?.k2,
            info: t('stats.price_factors.durationPriceFactor_info', {
              defaultValue:
                'If the election lasts longer, the price increases, and if there are more votes in a shorter time, the price also increases to reflect the higher demand for resources.',
            }),
            isNumber: true,
          },
          {
            label: t('stats.price_factors.encryptedPriceFactor', { defaultValue: 'Encryption' }),
            children: data?.factors?.k3,
            info: t('stats.price_factors.encryptedPriceFactor_info', {
              defaultValue: 'If an election requires encryption for maintaining secrecy until the end (encryptedVotes)',
            }),
            isNumber: true,
          },
          {
            label: t('stats.price_factors.anonymousPriceFactor', { defaultValue: 'Anonymous' }),
            children: data?.factors?.k4,
            info: t('stats.price_factors.anonymousPriceFactor_info', {
              defaultValue: 'If it requires additional measures to ensure voter privacy (anonymousVotes)',
            }),
            isNumber: true,
          },
          {
            label: t('stats.price_factors.overwritePriceFactor', { defaultValue: 'Overwrite' }),
            children: data?.factors?.k5,
            info: t('stats.price_factors.overwritePriceFactor_info', {
              defaultValue:
                "Is proportional to the maximum number of vote overwrites and the maximum number of votes allowed in the election. It also takes into account the blockchain's capacity to ensure the price reflects the current resource constraints.",
            }),
            isNumber: true,
          },
          {
            label: t('stats.price_factors.sizeScaling', { defaultValue: 'Growth factor' }),
            children: data?.factors?.k6,
            info: t('stats.price_factors.sizeScaling_info', {
              defaultValue:
                'Rate of price growth for elections with a maximum number of votes (maxCensusSize) exceeding the k7 threshold.',
            }),
            isNumber: true,
          },
          {
            label: t('stats.price_factors.censusSizeScaling', { defaultValue: 'Size trigger' }),
            children: data?.factors?.k7,
            info: t('stats.price_factors.censusSizeScaling_info', {
              defaultValue:
                'Represents a threshold value for the maximum number of votes (maxCensusSize) in an election. When the election size exceeds k7, the price growth becomes non-linear, increasing more rapidly beyond this point. ',
            }),
            isNumber: true,
          },
        ]}
      />
    </VStack>
  )
}
