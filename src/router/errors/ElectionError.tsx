import { Text } from '@chakra-ui/react'
import { useRouteError } from 'react-router-dom'
import ShowRawButton from '~components/Layout/ShowRawButton'
import RouteError from '~src/router/errors/RouteError'

export const ElectionError = () => {
  const error = useRouteError() as Error & { raw?: unknown; electionId: string }

  return (
    <>
      <RouteError />
      {!!error.electionId && <Text fontWeight='bold'>{error.electionId}</Text>}
      {!!error.raw && <ShowRawButton obj={error.raw} />}
    </>
  )
}
