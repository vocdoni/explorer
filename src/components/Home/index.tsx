import { Card, CardBody, Flex, Text } from '@chakra-ui/react'
import { Trans } from 'react-i18next'
import { useChainInfo } from '~src/queries/stats'
import Stats from '~components/Stats'

const StatsCard = ({ title, subtitle }: { title: string; subtitle: string }) => {
  return (
    <Card>
      <CardBody>
        <Text fontWeight='bold'>{title}</Text>
        <Text>{subtitle}</Text>
      </CardBody>
    </Card>
  )
}

const LandingPage = () => {
  const { data: stats } = useChainInfo({
    refetchInterval: 10000,
  })

  return (
    <Flex direction={'column'} gap={4}>
      <Text fontSize='5xl'>
        <Trans i18nKey='home.title'>Vocdoni explorer</Trans>
      </Text>
      <Text>
        <Trans i18nKey='home.subtitle'>
          The most flexible and secure voting protocol to organize any kind of voting process: single-choice,
          multiple-choice, weighted, quadratic voting and much more.
        </Trans>
      </Text>
      <Stats />
    </Flex>
  )
}

export default LandingPage
