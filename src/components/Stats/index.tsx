import {
  Box,
  Card,
  CardBody,
  CardHeader,
  CardProps,
  Flex,
  HStack,
  Icon,
  SkeletonText,
  Text,
  VStack,
} from '@chakra-ui/react'
import { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { IconType } from 'react-icons'
import { VscGraphLine } from 'react-icons/vsc'
import { LatestBlocks } from '~components/Stats/LatestBlocks'
import { RawModal } from '~components/Layout/ShowRawButton'
import { PriceFactors } from '~components/Stats/ChainDetails/PriceFactors'
import { ChainInfo } from '~components/Stats/ChainDetails/ChainInfo'
import { StatsCards } from '~components/Stats/ChainDetails/StatsCards'
import { TxCosts } from '~components/Stats/ChainDetails/TxCosts'

interface StatisticsCardProps {
  title: string
  icon: IconType
  raw?: object
  rightComp?: any
  isLoading?: boolean
}

export const StatisticsCardWrapper = ({
  title,
  icon,
  raw,
  children,
  rightComp,
  isLoading,
  ...rest
}: StatisticsCardProps & PropsWithChildren & CardProps) => (
  <Card flex='1' w={'full'} {...rest}>
    <CardHeader pb={0} display='flex' gap={3} alignItems='center' justifyContent={'space-between'} flexDir='row'>
      <HStack spacing={3}>
        <Icon color='textAccent1' fontSize='2xl' as={icon} />
        <Text>{title}</Text>
      </HStack>
      <Box>
        {!!raw && <RawModal color={'lightText'} fontSize={'xs'} obj={raw} />}
        {rightComp}
      </Box>
    </CardHeader>
    <CardBody>
      {isLoading && <SkeletonText noOfLines={3} spacing={3} skeletonHeight={3} py={2} />}
      {!isLoading && (
        <Flex h={'full'} direction={'column'} justify={'space-between'}>
          {children}
        </Flex>
      )}
    </CardBody>
  </Card>
)

const Stats = () => {
  const { t } = useTranslation()
  const cardSpacing = 4

  return (
    <Flex direction={'column'} gap={8}>
      <StatsCards />
      <Flex direction={{ base: 'column-reverse', lg: 'row' }} alignItems='start' gap={cardSpacing}>
        <StatisticsCardWrapper flex='2' minH={'530px'} title={t('stats.latest_blocks')} icon={VscGraphLine}>
          <LatestBlocks />
        </StatisticsCardWrapper>
        <VStack w={'full'} flex='3' spacing={cardSpacing}>
          <ChainInfo />
          <Flex direction={{ base: 'column', md: 'row' }} w={'full'} gap={cardSpacing}>
            <PriceFactors />
            <TxCosts />
          </Flex>
        </VStack>
      </Flex>
    </Flex>
  )
}

export default Stats
