import { Alert, AlertIcon, Code, Stack, Text } from '@chakra-ui/react'
import { Trans, useTranslation } from 'react-i18next'

export const NoResultsError = ({ msg }: { msg?: string }) => {
  const { t } = useTranslation()
  return <Text>{msg ?? t('errors.no_results', { defaultValue: 'Looks like there are no results to show.' })}</Text>
}

export const ContentError = ({ error }: { error: Error | undefined | null | string }) => {
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
