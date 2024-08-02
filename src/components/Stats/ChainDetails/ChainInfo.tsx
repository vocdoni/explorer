import { Badge, HStack, Text, VStack } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useChainInfo } from '~queries/stats'
import { useDateFns } from '~i18n/use-date-fns'
import { MdSpeed } from 'react-icons/md'
import { DetailsGrid, GridItemProps } from '~components/Layout/DetailsGrid'
import { StatisticsCardWrapper } from '~components/Stats'

const SyncBadge = ({ syncing }: { syncing: boolean }) => {
  const { t } = useTranslation()

  const label = syncing ? t('stats.syncing') : t('stats.in_sync')
  const color = syncing ? 'green' : 'orange'

  return <Badge colorScheme={color}>{label}</Badge>
}

export const ChainInfo = () => {
  const { t } = useTranslation()
  const { data: stats } = useChainInfo()
  const { formatDistance, format } = useDateFns()

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

  return (
    <StatisticsCardWrapper flex='2' w={'full'} icon={MdSpeed} title={t('stats.blockchain_info')} raw={stats}>
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
    </StatisticsCardWrapper>
  )
}