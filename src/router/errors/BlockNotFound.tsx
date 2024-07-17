import { Alert, AlertIcon, Code, Stack } from '@chakra-ui/react'
import { ErrAPI } from '@vocdoni/sdk'
import { Trans } from 'react-i18next'
import { useRouteError } from 'react-router-dom'
import RouteError from '~src/router/errors/RouteError'

export const BlockNotFound = () => {
  const error = useRouteError() as Error

  if (error instanceof ErrAPI && error.raw?.response?.status === 404) {
    return (
      <Stack spacing={4}>
        <Alert status='warning'>
          <AlertIcon />
          <Trans i18nKey={'blocks.block_not_found'}>
            The block you are trying to access has been pruned or it is not indexed
          </Trans>
        </Alert>
        <Code>{error.message}</Code>
      </Stack>
    )
  }

  return <RouteError />
}
