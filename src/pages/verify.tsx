import { Flex, Heading } from '@chakra-ui/react'
import { Trans } from 'react-i18next'
import { useParams } from 'react-router-dom'
import EnvelopeDetail from '~components/Envelope/Detail'
import { ErrorBoundary } from '~components/Layout/ErrorBoundary'
import { Loading } from '~components/Layout/Loading'
import { VerifyForm, VerifyFormMinified } from '~components/Verify'
import { RoutePath } from '~constants'
import { useVoteInfo } from '~queries/vote'

const Verify = () => {
  const { verifier }: { verifier?: string } = useParams()

  const { data, isLoading, isError } = useVoteInfo({
    verifier: verifier || '',
    enabled: !!verifier,
    refetchOnWindowFocus: false,
  })

  if (isLoading) {
    return <Loading />
  }

  if (!verifier) {
    return <VerifyForm />
  }

  return (
    <Flex direction={'column'} gap={4}>
      <VerifyFormMinified />
      {isError && (
        <Heading>
          <Trans i18nKey={'envelopes.not_found'}>Envelope not found</Trans>{' '}
        </Heading>
      )}
      {/* The search form is a sibling, so an unguarded throw here would leave the user without
          any way to try another receipt. Resets whenever a different vote is looked up. */}
      <ErrorBoundary resetKeys={[verifier]}>
        {data && <EnvelopeDetail route={RoutePath.Verify} {...data} />}
      </ErrorBoundary>
    </Flex>
  )
}

export default Verify
