import { IconType } from 'react-icons'
import { Box, Card, CardBody, Flex, Grid, Heading, Icon, Link, Stack, Text } from '@chakra-ui/react'
import { generatePath, Link as RouterLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useChainInfo } from '~queries/stats'
import { RefreshIntervalBlocks, RoutePath } from '~constants'
import { useTranslation } from 'react-i18next'
import { Icons } from '~src/theme/components/Icons'

interface IStatsCardProps {
  title: string
  description: string
  link?: string
  icon: IconType
}

const StatsCard = ({ title, description, link, icon }: IStatsCardProps) => (
  <Link as={RouterLink} to={generatePath(link || '')}>
    <Card direction={'row'} align={'center'}>
      <Box px={3}>
        <Icon as={icon} boxSize={7} />
      </Box>
      <Stack spacing={0} py={3}>
        <CardBody p={0}>
          <Text fontSize='sm'>{title}</Text>
          <Text fontWeight={'bold'} fontSize='md'>
            {description}
          </Text>
        </CardBody>
      </Stack>
    </Card>
  </Link>
)

interface IncrementalStatProps {
  value: number
  label: string
}

const IncrementalStat = ({ value, label }: IncrementalStatProps) => {
  const [displayNumber, setDisplayNumber] = useState(0)
  const duration = 2000

  useEffect(() => {
    let intervalId: NodeJS.Timeout
    let start = Date.now()
    const stepTime = duration / value

    intervalId = setInterval(() => {
      const elapsed = Date.now() - start
      const remainingTime = duration - elapsed
      const randomOffset = Math.floor(Math.random() * 10) // Random offset between 0 and 9
      const nextNumber = Math.min(value, Math.floor(elapsed / stepTime) + randomOffset)

      // Ensure the final number is the target number
      if (remainingTime <= stepTime) {
        setDisplayNumber(value)
        clearInterval(intervalId)
      } else {
        setDisplayNumber(nextNumber)
      }
    }, stepTime)

    return () => clearInterval(intervalId)
  }, [value, duration])

  return (
    <Flex flex={1} direction={'column'} align={'center'}>
      <Box>
        <Heading>{displayNumber}</Heading>
      </Box>
      <Text fontSize={'2xl'}>{label}</Text>
    </Flex>
  )
}

export const StatsCards = () => {
  const { data: stats } = useChainInfo({
    refetchInterval: RefreshIntervalBlocks,
  })
  const { t } = useTranslation()

  if (!stats) return null

  const averageBlockTime = Number((stats?.blockTime[0] || 0) / 1000).toFixed(1)

  const statsCards: IStatsCardProps[] = [
    {
      title: t('stats.average_block_time'),
      description: t('stats.seconds', {
        count: parseFloat(averageBlockTime),
      }),
      link: RoutePath.BlocksList,
      icon: Icons.ClockIcon,
    },
    {
      title: t('stats.block_height'),
      description: t('stats.blocks', {
        count: stats.height,
        defaultValue: '{{count}} blocks',
      }),
      link: RoutePath.BlocksList,
      icon: Icons.BlockIcon,
    },
    {
      title: t('stats.transactions_count', { defaultValue: 'Transactions count' }),
      description: t('stats.transactions', {
        count: stats.transactionCount,
        defaultValue: '{{count}} transactions',
      }),
      link: RoutePath.TransactionsList,
      icon: Icons.TxIcon,
    },
    {
      title: t('stats.validators_count', { defaultValue: 'Validators count' }),
      description: t('stats.validators', {
        count: stats.validatorCount,
        defaultValue: '{{count}} validators',
      }),
      link: RoutePath.Validators,
      icon: Icons.ValidatorIcon,
    },
  ]

  const incrementalStats: IncrementalStatProps[] = [
    {
      label: t('stats.organizations', { defaultValue: 'Organizations' }),
      value: stats.organizationCount,
    },
    {
      label: t('stats.elections', { defaultValue: 'Elections' }),
      value: stats.electionCount,
    },
    {
      label: t('stats.votes', { defaultValue: 'Votes' }),
      value: stats.voteCount,
    },
  ]

  return (
    <Flex direction={'column'} gap={4}>
      <Grid templateColumns={{ base: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={4} mb={8}>
        {statsCards.map((card, i) => (
          <StatsCard key={i} {...card} />
        ))}
      </Grid>

      <Flex w={'full'} justify={'space-around'} wrap={'wrap'}>
        {incrementalStats.map((card, i) => (
          <IncrementalStat key={i} {...card} />
        ))}
      </Flex>
    </Flex>
  )
}
