import { useParams } from 'react-router-dom'
import { useVoteInfo } from '~queries/vote'
import { VerifyForm, VerifyFormMinified } from '~components/Verify'
import { Loading } from '~components/Layout/Loading'
import { Flex, Heading } from '@chakra-ui/react'
import { Trans } from 'react-i18next'
import EnvelopeDetail from '~components/Envelope/Detail'
import { RoutePath } from '~constants'

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
      {data && <EnvelopeDetail route={RoutePath.Verify} {...data} />}
    </Flex>
  )
}

export default Verify
