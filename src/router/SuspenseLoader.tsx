import { Card, CardBody, SkeletonText, Spinner, Square, Stack, Text } from '@chakra-ui/react'
import { ReactNode, Suspense } from 'react'
import { Trans } from 'react-i18next'

export const Loading = () => (
  <Square centerContent size='full' minHeight='100vh'>
    <Spinner size='sm' mr={3} />
    <Text>
      <Trans i18nKey='loading'>Loading...</Trans>
    </Text>
  </Square>
)

export const LoadingCards = ({ length = 4 }: { length?: number }) => (
  <Stack>
    {Array.from({ length }).map((_, i) => (
      <Card key={i}>
        <CardBody>
          <SkeletonText noOfLines={3} spacing='3' skeletonHeight='3' />
        </CardBody>
      </Card>
    ))}
  </Stack>
)

export const SuspenseLoader = ({ children }: { children: ReactNode }) => (
  <Suspense fallback={<Loading />}>{children}</Suspense>
)
