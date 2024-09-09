import { Flex, Heading } from '@chakra-ui/react'
import { useParams, useRouteError } from 'react-router-dom'
import { ReducedTextAndCopy } from '~components/Layout/CopyButton'
import ShowRawButton from '~components/Layout/ShowRawButton'
import RouteError from '~src/router/errors/RouteError'

export const ElectionError = () => {
  const error = useRouteError() as Error & { raw?: unknown; electionId: string }
  const { pid }: { pid?: string } = useParams()

  const electionId = pid || error.electionId || ''

  let raw: any
  let title = ''
  if (error.raw) {
    raw = error.raw
    title = raw['metadata']['title']['default']
  }

  return (
    <Flex direction={'column'} mt={{ base: '20px', lg: '40px' }} gap={6} wordBreak='break-all'>
      {!!title && (
        <Heading fontSize={'2xl'} fontWeight='bold'>
          {title}
        </Heading>
      )}
      {!!electionId && (
        <Flex>
          <ReducedTextAndCopy fontSize={'lg'} color={'textAccent1'} toCopy={electionId}>
            {electionId}
          </ReducedTextAndCopy>
        </Flex>
      )}
      <RouteError />
      {!!raw && <ShowRawButton obj={raw} />}
    </Flex>
  )
}
