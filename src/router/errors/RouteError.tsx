import { Alert, AlertIcon, Code, Stack } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useRouteError } from 'react-router-dom'

const RouteError = () => {
  const error = useRouteError() as Error

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.trace('error received on route:', error)
    }
  }, [])

  return (
    <Stack spacing={4}>
      <Alert status='warning'>
        <AlertIcon />
        Looks like the content you were accessing threw an error.
      </Alert>
      <Code>{error.message}</Code>
    </Stack>
  )
}

export default RouteError
