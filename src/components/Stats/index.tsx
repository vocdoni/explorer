import { Flex, VStack } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { VscGraphLine } from 'react-icons/vsc'
import { LatestBlocks } from '~components/Stats/LatestBlocks'
import { ChainInfo } from '~components/Stats/ChainDetails/ChainInfo'
import { StatsCards } from '~components/Stats/ChainDetails/StatsCards'
import { TxCosts } from '~components/Stats/ChainDetails/TxCosts'
import { StatsCardWrapper } from '~components/Stats/StatsCardWrapper'

const Stats = () => {
  const { t } = useTranslation()
  const cardSpacing = 4

  return (
    <Flex direction={'column'} gap={8}>
      <StatsCards />
      <Flex direction={{ base: 'column', lg: 'row' }} alignItems='start' gap={cardSpacing}>
        <VStack w={'full'} flex='3' spacing={cardSpacing}>
          <ChainInfo />
          <StatsCardWrapper flex='2' title={t('stats.latest_blocks')} icon={VscGraphLine}>
            <LatestBlocks />
          </StatsCardWrapper>
        </VStack>
        <VStack w={'full'} flex='3' spacing={cardSpacing}>
          <TxCosts />
        </VStack>
      </Flex>
    </Flex>
  )
}

export default Stats
