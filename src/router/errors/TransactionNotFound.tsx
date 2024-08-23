import { Alert, AlertIcon, Code, Flex, Heading, Stack, Text, VStack } from '@chakra-ui/react'
import { ErrTransactionNotFound } from '@vocdoni/sdk'
import { Trans } from 'react-i18next'
import { useParams, useRouteError } from 'react-router-dom'
import RouteError from '~src/router/errors/RouteError'

export const TransactionNotFound = () => {
  const error = useRouteError() as Error
  const { block, index, hashOrHeight }: { block?: string; index?: string; hashOrHeight?: string } = useParams()

  if (error instanceof ErrTransactionNotFound) {
    return (
      <Flex direction={'column'} mt={{ base: '20px', lg: '40px' }} gap={6} wordBreak='break-all'>
        <VStack align='start'>
          <Heading isTruncated wordBreak='break-word' mb={0}>
            <Trans i18nKey={'transactions.not_found'}>Transaction not found</Trans>
          </Heading>
        </VStack>
        <Flex gap={2}>
          {!!block && (
            <Text>
              <Trans i18nKey={'transactions.on_block'} block={block}>
                On block {{ block }}
              </Trans>
            </Text>
          )}
          {!!index && (
            <Text>
              <Trans i18nKey={'transactions.with_index'} index={index}>
                With index {{ index }}
              </Trans>
            </Text>
          )}
          {!!hashOrHeight && (
            <Text>
              <Trans i18nKey={'transactions.with_hash_or_height'} hashOrHeight={hashOrHeight}>
                With hash or height {{ hashOrHeight }}
              </Trans>
            </Text>
          )}
        </Flex>
        <Stack spacing={4}>
          <Alert status='warning'>
            <AlertIcon />
            <Trans i18nKey={'transactions.not_found_message'}>
              The transaction you are trying to access is not found
            </Trans>
          </Alert>
          <Code>{error.message}</Code>
        </Stack>
      </Flex>
    )
  }

  return <RouteError />
}
