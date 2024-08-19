import { Box, Card, CardBody, CardHeader, CardProps, Flex, HStack, Icon, SkeletonText, Text } from '@chakra-ui/react'
import { PropsWithChildren } from 'react'
import { IconType } from 'react-icons'
import { RawModal } from '~components/Layout/ShowRawButton'
import { ContentError, ContentErrorType } from '~components/Layout/ContentError'

interface StatisticsCardProps {
  title: string
  icon: IconType
  raw?: object
  rightComp?: any
  isLoading?: boolean
  isError?: boolean
  error?: ContentErrorType
}

export const StatsCardWrapper = ({
  title,
  icon,
  raw,
  children,
  rightComp,
  isLoading,
  isError,
  error,
  ...rest
}: StatisticsCardProps & PropsWithChildren & CardProps) => {
  return (
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
        <CardBodyWrapper error={error} isError={isError} isLoading={isLoading}>
          {children}
        </CardBodyWrapper>
      </CardBody>
    </Card>
  )
}

const CardBodyWrapper = ({
  isLoading,
  isError,
  error,
  children,
}: Pick<StatisticsCardProps, 'isLoading' | 'isError' | 'error'> & PropsWithChildren) => {
  if (isLoading) {
    return <SkeletonText noOfLines={3} spacing={3} skeletonHeight={3} py={2} />
  }
  if (isError) {
    return <ContentError error={error} />
  }
  return (
    <Flex h={'full'} direction={'column'} justify={'space-between'}>
      {children}
    </Flex>
  )
}
