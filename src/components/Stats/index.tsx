import {
  Box,
  Card,
  CardBody,
  CardHeader,
  CardProps,
  CircularProgress,
  CircularProgressLabel,
  Flex,
  Grid,
  Icon,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react'
import { PropsWithChildren, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IconType } from 'react-icons'
import { generatePath, Link } from 'react-router-dom'
import { ChainCosts, ChainInfo } from '~components/Stats/ChainInfo'
import { RefreshIntervalBlocks, RoutePath } from '~constants'
import { useChainInfo } from '~queries/stats'
import { Icons } from '~src/theme/components/Icons'
import { VscGraphLine } from 'react-icons/vsc'
import { LatestBlocks } from '~components/Stats/LatestBlocks'

interface IStatsCardProps {
  title: string
  description: string
  link?: string
  icon: IconType
}

const StatsCard = ({ title, description, link, icon }: IStatsCardProps) => (
  <Link to={generatePath(link || '')}>
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

interface CircularStatProps {
  value: number
  label: string
}

const CircularStat = ({ value, label }: CircularStatProps) => {
  const [progressValue, setProgressValue] = useState(0)

  useEffect(() => {
    let startValue = 0
    const interval = setInterval(() => {
      startValue += 1
      setProgressValue(startValue)
      if (startValue >= 100) {
        clearInterval(interval)
      }
    }, 15)

    return () => clearInterval(interval)
  }, [value])

  return (
    <Flex direction={'column'} align={'center'}>
      <Box>
        <CircularProgress color='accent1' value={progressValue} size='130px'>
          <CircularProgressLabel>{Math.ceil((value / progressValue) * 100)}</CircularProgressLabel>
        </CircularProgress>
      </Box>
      <Text fontSize={'2xl'}>{label}</Text>
    </Flex>
  )
}

interface StatisticsCardProps {
  title: string
  icon: IconType
}

export const StatisticsCardWrapper = ({
  title,
  icon,
  children,
  ...rest
}: StatisticsCardProps & PropsWithChildren & CardProps) => (
  <Card flex='1' w={'full'} {...rest}>
    <CardHeader pb={0} display='flex' gap={3} alignItems='center' flexDir='row'>
      <Icon color='textAccent1' fontSize='2xl' as={icon} />
      <Text>{title}</Text>
    </CardHeader>
    <CardBody>{children}</CardBody>
  </Card>
)

const Stats = () => {
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

  const circularStats: CircularStatProps[] = [
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
        {circularStats.map((card, i) => (
          <CircularStat key={i} {...card} />
        ))}
      </Flex>
      <Flex direction={{ base: 'column-reverse', lg: 'row' }} alignItems='start' gap={4}>
        <StatisticsCardWrapper minH={'530px'} title={t('stats.latest_blocks')} icon={VscGraphLine}>
          <LatestBlocks />
        </StatisticsCardWrapper>
        <VStack>
          <ChainInfo />
          <ChainCosts />
        </VStack>
      </Flex>
    </Flex>
  )
}

export default Stats
