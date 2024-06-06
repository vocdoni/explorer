import { Flex, Heading, SkeletonText, Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useChainInfo } from '~queries/stats'
import { useDateFns } from '~i18n/use-date-fns'

export const ChainInfo = () => {
  const { t } = useTranslation()
  const { data: stats } = useChainInfo()
  const { formatDistance } = useDateFns()

  const syncing = stats?.syncing ? t('stats.syncing') : t('stats.in_sync')
  const genesisBlockDate = stats?.genesisTime ? formatDistance(new Date(stats?.genesisTime), new Date()) : ''

  const statsCards = [
    {
      name: t('stats.network_id'),
      data: stats?.chainId,
    },
    {
      name: t('stats.block_height'),
      data: stats?.height,
    },

    {
      name: t('stats.nr_of_validators'),
      data: stats?.validatorCount,
    },
    {
      name: t('stats.sync_status'),
      data: syncing,
    },

    {
      name: t('stats.genesis_block_date'),
      data: genesisBlockDate,
    },
  ]

  return (
    <Flex direction={'column'} gap={8} align={'start'}>
      {statsCards.map((stat, i) => {
        return (
          <Flex key={i} direction={'column'} gap={2} align={'start'}>
            <Heading size={'sm'}>{stat.name}</Heading>
            {!stats ? (
              <SkeletonText noOfLines={1} spacing='3' skeletonHeight='3' />
            ) : (
              <Text color={'lightText'} fontSize='md'>
                {stat.data}
              </Text>
            )}
          </Flex>
        )
      })}
    </Flex>
  )
}
