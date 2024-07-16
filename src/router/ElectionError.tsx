import { Text } from '@chakra-ui/react'
import { useRouteError } from 'react-router-dom'
import RouteError from '~src/router/RouteError'
import ShowRawButton from '~components/Layout/ShowRawButton'

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
