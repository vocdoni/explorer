import { Card, CardBody, SkeletonText, SkeletonTextProps, Spinner, Square, Text } from '@chakra-ui/react'
import { Trans } from 'react-i18next'

export const Loading = () => (
  <Square centerContent size='full' minHeight='100vh'>
    <Spinner size='sm' mr={3} />
    <Text>
      <Trans i18nKey='loading'>Loading...</Trans>
    </Text>
  </Square>
)

export const LoadingCards = ({ length = 4, ...rest }: { length?: number } & SkeletonTextProps) => (
  <>
    {Array.from({ length }).map((_, i) => (
      <Card key={i}>
        <CardBody>
          <SkeletonText noOfLines={3} spacing='3' skeletonHeight='3' {...rest} />
        </CardBody>
      </Card>
    ))}
  </>
)
