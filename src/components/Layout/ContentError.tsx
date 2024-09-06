import { Alert, AlertIcon, Code, Stack } from '@chakra-ui/react'
import { Trans, useTranslation } from 'react-i18next'

export const NoResultsError = ({ msg }: { msg?: string }) => {
  const { t } = useTranslation()
  return (
    <Alert status='info'>
      <AlertIcon />
      {msg ?? t('errors.no_results', { defaultValue: 'Looks like there is nothing to show.' })}
    </Alert>
  )
}

export type ContentErrorType = Error | undefined | null | string

export const ContentError = ({ error }: { error: ContentErrorType }) => {
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
