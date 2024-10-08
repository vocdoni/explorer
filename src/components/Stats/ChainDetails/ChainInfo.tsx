import { Badge, HStack, Text, VStack } from '@chakra-ui/react'
import { Trans, useTranslation } from 'react-i18next'
import { MdSpeed } from 'react-icons/md'
import { DetailsGrid, GridItemProps } from '~components/Layout/DetailsGrid'
import { PriceFactorsModal } from '~components/Stats/ChainDetails/PriceFactors'
import { TxCostsModal } from '~components/Stats/ChainDetails/TxCosts'
import { StatsCardWrapper } from '~components/Stats/StatsCardWrapper'
import { useDateFns } from '~i18n/use-date-fns'
import { useChainInfo } from '~queries/stats'

const SyncBadge = ({ syncing }: { syncing: boolean }) => {
  const { t } = useTranslation()

  const label = syncing ? t('stats.syncing') : t('stats.in_sync')
  const color = syncing ? 'orange' : 'green'

  return <Badge colorScheme={color}>{label}</Badge>
}

export const ChainInfo = () => {
  const { t } = useTranslation()
  const { data: stats, isError, error } = useChainInfo()
  const { format } = useDateFns()

  if (!stats) return null

  const genesisBlockDate = format(new Date(stats.genesisTime), 'PPPpp')
  const timestampInfo = format(new Date(stats?.blockTimestamp * 1000), 'hh:mm:ss')

  const statsData: GridItemProps[] = [
    {
      label: t('stats.maxCensusSize', { defaultValue: 'Max Census Size' }),
      children: stats.maxCensusSize,
      isNumber: true,
    },
    {
      label: t('stats.networkCapacity', { defaultValue: 'Capacity (votes/block)' }),
      // Not typed on the SDK
      // @ts-ignore
      children: stats.networkCapacity,
      isNumber: true,
    },
    {
      label: t('stats.initial_height', { defaultValue: 'Epoch initial Height' }),
      // Not typed on the SDK
      // @ts-ignore
      children: stats.initialHeight,
      isNumber: true,
    },
    {
      label: t('stats.blockTimestamp', { defaultValue: 'Block timestamp' }),
      children: timestampInfo,
      isNumber: true,
    },
  ]

  const tokensData: GridItemProps[] = [
    {
      label: t('stats.tx_prices', { defaultValue: 'Transaction prices' }),
      children: <TxCostsModal />,
      isNumber: true,
    },
    {
      label: t('stats.price_factors.title', { defaultValue: 'Price factors' }),
      children: <PriceFactorsModal />,
      isNumber: true,
    },
  ]

  return (
    <StatsCardWrapper
      flex='2'
      w={'full'}
      icon={MdSpeed}
      title={t('stats.blockchain_info')}
      raw={stats}
      isError={isError}
      error={error}
    >
      <VStack pb={4} align={'start'} spacing={1}>
        <HStack>
          <Text fontSize='lg' fontWeight={'bold'}>
            {stats.chainId}
          </Text>
          <SyncBadge syncing={stats.syncing} />
        </HStack>
        <Text color={'lightText'} fontSize='md'>
          {t('stats.genesis', {
            date: genesisBlockDate,
            defaultValue: 'Chain Genesis Epoch from {{date}}',
          })}
        </Text>
      </VStack>
      <DetailsGrid templateColumns={{ base: '1fr', sm: '1fr 1fr' }} details={statsData} rowGap={0} />
      <Text fontSize='lg' fontWeight={'bold'} pt={2}>
        <Trans i18nKey={'stats.tokens'}>Gas token details</Trans>
      </Text>
      <DetailsGrid templateColumns={{ base: '1fr', sm: '1fr 1fr' }} details={tokensData} rowGap={0} />
    </StatsCardWrapper>
  )
}
