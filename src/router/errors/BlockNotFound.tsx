import { Alert, AlertIcon, Box, Code, Flex, Heading, Stack, VStack } from '@chakra-ui/react'
import { ErrBlockNotFound } from '@vocdoni/sdk'
import { Trans } from 'react-i18next'
import { useParams, useRouteError } from 'react-router-dom'
import RouteError from '~src/router/errors/RouteError'
import Layout from '~src/layout/Default'

export const BlockNotFound = () => {
  const error = useRouteError() as Error
  const { height }: { height?: number } = useParams()

  if (error instanceof ErrBlockNotFound) {
    return (
      <Flex direction={'column'} mt={{ base: '20px', lg: '40px' }} gap={6} wordBreak='break-all'>
        <VStack align='start'>
          <Heading isTruncated wordBreak='break-word' mb={0}>
            <Trans i18nKey={'blocks.block_detail'} height={height}>
              Block #{{ height }}
            </Trans>
          </Heading>
        </VStack>
        <Stack spacing={4}>
          <Alert status='warning'>
            <AlertIcon />
            <Trans i18nKey={'blocks.block_not_found'}>
              The block you are trying to access has been pruned or it is not indexed
            </Trans>
          </Alert>
          <Code>{error.message}</Code>
        </Stack>
      </Flex>
    )
  }

  return <RouteError />
}
