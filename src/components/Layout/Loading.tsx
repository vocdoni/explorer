import {
  Card,
  CardBody,
  Flex,
  SkeletonCircle,
  SkeletonText,
  SkeletonTextProps,
  Spinner,
  Square,
  Text,
} from '@chakra-ui/react'
import { Trans } from 'react-i18next'

export const Loading = () => (
  <Square centerContent size='full' minHeight='100vh'>
    <Spinner size='sm' mr={3} />
    <Text>
      <Trans i18nKey='loading'>Loading...</Trans>
    </Text>
  </Square>
)

export type SkeletonCardsProps = {
  length?: number
  skeletonCircle?: boolean
} & SkeletonTextProps

export const LoadingCards = ({ length = 4, skeletonCircle, ...rest }: SkeletonCardsProps) => (
  <>
    {Array.from({ length }).map((_, i) => (
      <Card key={i} direction='row'>
        {skeletonCircle && (
          <>
            <Flex alignItems='center' flexWrap='wrap' pl={4}>
              <SkeletonCircle size='12' />
            </Flex>
          </>
        )}
        <CardBody>
          <SkeletonText noOfLines={3} spacing={3} skeletonHeight={3} py={2} {...rest} />
        </CardBody>
      </Card>
    ))}
  </>
)
