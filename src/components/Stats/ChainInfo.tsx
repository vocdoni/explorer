import { Badge, Flex, HStack, Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useChainCosts, useChainInfo } from '~queries/stats'
import { useDateFns } from '~i18n/use-date-fns'
import { MdSpeed } from 'react-icons/md'
import { DetailsGrid, GridItemProps } from '~components/Layout/DetailsGrid'
import { StatisticsCardWrapper } from '~components/Stats/index'

const SyncBadge = ({ syncing }: { syncing: boolean }) => {
  const { t } = useTranslation()

  const label = syncing ? t('stats.syncing') : t('stats.in_sync')
  const color = syncing ? 'green' : 'orange'

  return <Badge colorScheme={color}>{label}</Badge>
}

export const ChainInfo = () => {
  const { t } = useTranslation()
  const { data: stats } = useChainInfo()
  const { formatDistance } = useDateFns()
  const genesisBlockDate = stats?.genesisTime ? formatDistance(new Date(stats?.genesisTime), new Date()) : ''

  if (!stats) return null

  const statsData: GridItemProps[] = [
    {
      label: t('stats.maxCensusSize', { defaultValue: 'Max Census Size' }),
      children: stats.maxCensusSize,
    },

    {
      label: t('stats.networkCapacity', { defaultValue: 'Network Capacity' }),
      // Not typed on the SDK
      // @ts-ignore
      children: stats.networkCapacity,
    },
  ]

  return (
    <StatisticsCardWrapper flex='2' w={'full'} icon={MdSpeed} title={t('stats.blockchain_info')} raw={stats}>
      <Flex direction={'column'} align={'start'} gap={4}>
        <HStack>
          <Text fontSize='lg' fontWeight={'bold'}>
            {stats.chainId}
          </Text>
          <SyncBadge syncing={stats.syncing} />
          <Text color={'lightText'} fontSize='md'>
            {t('stats.genesis', { date: genesisBlockDate, defaultValue: 'Genesis {{date}}' })}
          </Text>
        </HStack>
        <DetailsGrid details={statsData} gap={3} />
      </Flex>
    </StatisticsCardWrapper>
  )
}

export const ChainCosts = () => {
  const { data } = useChainCosts({})
  const { t } = useTranslation()
  return (
    <StatisticsCardWrapper flex='1' w={'full'} icon={MdSpeed} title={t('stats.costs')}>
      <Flex direction={'column'} align={'start'} gap={4}>
        <HStack>
          <Text fontSize='lg' fontWeight={'bold'}>
            {t('stats.costs')}
          </Text>
        </HStack>
        {/*<DetailsGrid*/}
        {/*  details={[*/}
        {/*    {*/}
        {/*      label: t('stats.costs.tx', { defaultValue: 'Transaction' }),*/}
        {/*      children: data?.tx,*/}
        {/*    },*/}
        {/*    {*/}
        {/*      label: t('stats.costs.vote', { defaultValue: 'Vote' }),*/}
        {/*      children: data?.vote,*/}
        {/*    },*/}
        {/*    {*/}
        {/*      label: t('stats.costs.election', { defaultValue: 'Election' }),*/}
        {/*      children: data?.election,*/}
        {/*    },*/}
        {/*  ]}*/}
        {/*  gap={3}*/}
        {/*/>*/}
      </Flex>
    </StatisticsCardWrapper>
  )
}
