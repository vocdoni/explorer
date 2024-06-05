import { Box, Card, CardBody, CardHeader, Flex, Grid, Heading, HStack, Text } from '@chakra-ui/react'
import { PropsWithChildren, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { MdSpeed } from 'react-icons/md'
import { VscGraphLine } from 'react-icons/vsc'
import { ChainInfo } from '~components/Stats/ChainInfo'
import { LatestBlocks } from '~components/Stats/LatestBlocks'
import { useChainInfo } from '~queries/stats'

interface IStatsCardProps {
  title: string
  description: string
}

const StatsCard = ({ title, description }: IStatsCardProps) => {
  return (
    <Card>
      <CardBody>
        <Heading size='xs'>{title}</Heading>
        <Text pt='2' fontSize='sm'>
          {description}
        </Text>
      </CardBody>
    </Card>
  )
}

interface StatisticsCardProps {
  title: string
  icon: ReactNode
}

const StatisticsCardWrapper = ({ title, icon, children }: StatisticsCardProps & PropsWithChildren) => {
  return (
    <Card flex='1' w={'full'} minH={'530px'}>
      <CardHeader pb={0}>
        <HStack gap={2} align={'bottom'}>
          <Box color={'textAccent1'} fontSize='2xl'>
            {icon}
          </Box>
          <Text fontSize='2xl' fontWeight={'bold'}>
            {title}
          </Text>
        </HStack>
      </CardHeader>
      <CardBody>{children}</CardBody>
    </Card>
  )
}

const Stats = () => {
  const { data: stats } = useChainInfo({
    refetchInterval: 10000,
  })
  const { t } = useTranslation()

  const averageBlockTime = Number((stats?.blockTime[0] || 0) / 1000).toFixed(1)

  const statsCards = [
    {
      title: t('stats.average_block_time'),
      description: t('stats.seconds', {
        count: parseFloat(averageBlockTime),
      }),
    },
    {
      title: t('stats.total_elections'),
      description: t('stats.electionCount', {
        count: stats?.electionCount,
      }),
    },
    {
      title: t('stats.total_organizations'),
      description: t('stats.organizations', {
        count: stats?.organizationCount,
      }),
    },
    {
      title: t('stats.total_votes'),
      description: t('stats.votes', {
        count: stats?.voteCount,
      }),
    },
  ]

  return (
    <Flex direction={'column'} gap={4}>
      <Grid templateColumns={{ base: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={4} mb={8}>
        {statsCards.map((card, i) => (
          <StatsCard key={i} title={card.title} description={card.description} />
        ))}
      </Grid>
      <Flex direction={{ base: 'column', lg: 'row' }} minWidth='max-content' alignItems='start' gap={4}>
        <StatisticsCardWrapper title={t('stats.latest_blocks')} icon={<VscGraphLine />}>
          <LatestBlocks />
        </StatisticsCardWrapper>
        <StatisticsCardWrapper title={t('stats.blockchain_info')} icon={<MdSpeed />}>
          <ChainInfo />
        </StatisticsCardWrapper>
      </Flex>
    </Flex>
  )
}

export default Stats
