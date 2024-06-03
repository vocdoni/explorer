import { Card, CardBody, Flex, Grid, Heading, Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useChainInfo } from '~src/queries/stats'
import { LatestBlocks } from '~components/Stats/LatestBlocks'

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
    <Flex direction={'column'}>
      <Grid templateColumns={{ base: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={4} mb={8}>
        {statsCards.map((card, i) => (
          <StatsCard key={i} title={card.title} description={card.description} />
        ))}
      </Grid>
      <Card>
        <CardBody>
          <LatestBlocks />
        </CardBody>
      </Card>
    </Flex>
  )
}

export default Stats
