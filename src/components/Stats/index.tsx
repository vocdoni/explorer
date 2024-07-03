import { Card, CardBody, CardHeader, Flex, Grid, Icon, Text } from '@chakra-ui/react'
import { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { IconType } from 'react-icons'
import { MdSpeed } from 'react-icons/md'
import { VscGraphLine } from 'react-icons/vsc'
import { generatePath, Link } from 'react-router-dom'
import { ChainInfo } from '~components/Stats/ChainInfo'
import { LatestBlocks } from '~components/Stats/LatestBlocks'
import { RefreshIntervalBlocks, RoutePath } from '~constants'
import { useChainInfo } from '~queries/stats'

interface IStatsCardProps {
  title: string
  description: string
}

const StatsCard = ({ title, description }: IStatsCardProps) => (
  <Card>
    <CardHeader pb={0} fontSize='md' fontWeight={600}>
      {title}
    </CardHeader>
    <CardBody fontSize='sm' pt={1}>
      {description}
    </CardBody>
  </Card>
)

interface StatisticsCardProps {
  title: string
  icon: IconType
}

const StatisticsCardWrapper = ({ title, icon, children }: StatisticsCardProps & PropsWithChildren) => (
  <Card flex='1' w={'full'} minH={'530px'}>
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

  const averageBlockTime = Number((stats?.blockTime[0] || 0) / 1000).toFixed(1)

  const statsCards = [
    {
      title: t('stats.average_block_time'),
      description: t('stats.seconds', {
        count: parseFloat(averageBlockTime),
      }),
      link: RoutePath.BlocksList,
    },
    {
      title: t('stats.total_elections'),
      description: t('stats.electionCount', {
        count: stats?.electionCount,
      }),
      link: RoutePath.ProcessesList,
    },
    {
      title: t('stats.total_organizations'),
      description: t('stats.organizations', {
        count: stats?.organizationCount,
      }),
      link: RoutePath.OrganizationsList,
    },
    {
      title: t('stats.total_votes'),
      description: t('stats.votes', {
        count: stats?.voteCount,
      }),
      link: RoutePath.TransactionsList,
    },
  ]

  return (
    <Flex direction={'column'} gap={4}>
      <Grid templateColumns={{ base: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={4} mb={8}>
        {statsCards.map((card, i) => (
          <Link to={generatePath(card.link)}>
            <StatsCard key={i} title={card.title} description={card.description} />
          </Link>
        ))}
      </Grid>
      <Flex direction={{ base: 'column', lg: 'row' }} alignItems='start' gap={4}>
        <StatisticsCardWrapper title={t('stats.latest_blocks')} icon={VscGraphLine}>
          <LatestBlocks />
        </StatisticsCardWrapper>
        <StatisticsCardWrapper title={t('stats.blockchain_info')} icon={MdSpeed}>
          <ChainInfo />
        </StatisticsCardWrapper>
      </Flex>
    </Flex>
  )
}

export default Stats
