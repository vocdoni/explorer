import { Spinner, Square, Text } from '@chakra-ui/react'
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

export const SuspenseLoader = ({ children }: { children: ReactNode }) => (
  <Suspense fallback={<Loading />}>{children}</Suspense>
)
