import { Alert, AlertIcon, Code, Stack } from '@chakra-ui/react'
import { Trans } from 'react-i18next'

const LoadingError = ({ error }: { error: Error | undefined | null | string }) => {
  return (
    <Stack spacing={4}>
      <Alert status='warning'>
        <AlertIcon />
        <Trans i18nKey={'errors.content_error'}>Looks like the content you were accessing threw an error.</Trans>
      </Alert>
      {error && <Code>{typeof error === 'string' ? error : error.message}</Code>}
    </Stack>
  )
}

export default LoadingError
