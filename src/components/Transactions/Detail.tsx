import { Box, Card, CardBody, Code, Flex, Heading, Link, Text } from '@chakra-ui/react'
import { AdminTx, ensure0x, NewProcessTx, SetProcessTx, TransactionType, Tx, VoteEnvelope } from '@vocdoni/sdk'
import { Trans } from 'react-i18next'
import { generatePath, Link as RouterLink } from 'react-router-dom'
import ShowRawButton from '~components/Layout/ShowRawButton'
import { TransactionTypeBadge } from '~components/Transactions/TransactionCard'
import { RoutePath } from '~constants'
import { useDateFns } from '~i18n/use-date-fns'
import { useBlockToDate } from '~queries/stats'
import { b64ToHex, objectB64StringsToHex } from '~utils/objects'

export const TransactionDetail = (tx: Tx) => {
  const { data } = useBlockToDate({ height: tx.txInfo.blockHeight })
  const { formatDistance } = useDateFns()

  let createdOn = ''
  if (data) {
    createdOn = formatDistance(new Date(data.date), new Date())
  }

  const blockHeight = tx.txInfo.blockHeight
  const txIndex = tx.txInfo.transactionIndex

  let entity = ''
  let process = ''
  let votePackage = ''

  if (!tx.tx) return

  const txPayload = tx.tx as any
  const txType = Object.keys(tx.tx)[0] as TransactionType

  // For some reason, response payload converted transactions have some
  // values into base64 string. This values, on the interface declaration are
  // `Uint8Array`, but on JSON decoding are treated as 'strings'.
  // So is a little bit tricky to know if a payload value have to be
  // converted to a b64 or not. Probably reflection could help with that. BTW
  // is solved checking regex.

  const rawTx = JSON.parse(JSON.stringify(tx))
  objectB64StringsToHex(rawTx, ['txInfo'])

  switch (txType) {
    case 'vote': {
      const voteTx = txPayload.vote as VoteEnvelope
      if (voteTx.votePackage) {
        // Decode the vote package from base64
        votePackage = atob(voteTx.votePackage)
        // And copy it alsow to rawTx
        rawTx['tx']['vote']['votePackage'] = JSON.parse(votePackage)
      }
      process = ensure0x(b64ToHex(voteTx.processId))
      break
    }
    case 'newProcess': {
      const newProcessTx = txPayload.newProcess as NewProcessTx
      if (newProcessTx.process) {
        process = ensure0x(b64ToHex(newProcessTx.process.processId as unknown as string))
        entity = ensure0x(b64ToHex(newProcessTx.process.entityId as unknown as string))
      }
      break
    }
    case 'admin': {
      const adminTx = txPayload.admin as AdminTx
      process = ensure0x(b64ToHex(adminTx.processId as unknown as string))
      break
    }
    case 'setProcess': {
      const setProcessTx = txPayload.setProcess as SetProcessTx
      process = ensure0x(b64ToHex(setProcessTx.processId as unknown as string))

      if (setProcessTx?.results) {
        entity = ensure0x(b64ToHex(setProcessTx.results.entityId as unknown as string))
      }
      break
    }
  }

  return (
    <Flex direction={'column'} mt={'40px'} gap={6}>
      <Heading isTruncated wordBreak='break-word'>
        <Trans i18nKey={'transactions.tx_detail'}>Transaction Details</Trans>
      </Heading>
      <Box>
        <TransactionTypeBadge transactionType={txType} />
      </Box>
      <Link as={RouterLink} to={generatePath(RoutePath.Block, { height: blockHeight.toString() })}>
        <Text color={'blueText'} fontSize={'2xl'}>
          <Trans i18nKey={'transactions.on_block_n'} height={blockHeight}>
            On Block {{ height: blockHeight }}
          </Trans>
        </Text>
      </Link>
      <Text color={'lightText'}>
        <Trans i18nKey={'transactions.transaction_index'} txIndex={txIndex}>
          Transaction index: {{ txIndex }}
        </Trans>
      </Text>
      <Text color={'lightText'}>
        <Trans i18nKey={'transactions.created_on'} createdOn={createdOn}>
          Created {{ createdOn }}
        </Trans>
      </Text>

      <Card wordBreak='break-all'>
        <CardBody>
          <Text fontSize={'xl'}>{ensure0x(tx.txInfo.transactionHash)}</Text>
          {process && (
            <Text>
              <Trans
                i18nKey={'transactions.belongs_to_process'}
                components={{
                  a: <Link as={RouterLink} to={generatePath(RoutePath.Process, { pid: process })} />,
                }}
                values={{ process }}
              />
            </Text>
          )}
          {entity && (
            <Text>
              <Trans
                i18nKey={'transactions.belong_to_organization'}
                components={{
                  a: <Link as={RouterLink} to={generatePath(RoutePath.Organization, { pid: entity, page: null })} />,
                }}
                values={{ organization: entity }}
              />
            </Text>
          )}
          {votePackage && (
            <>
              <Text>
                <Trans i18nKey={'transactions.vote_package'}>Vote package:</Trans>
              </Text>
              <Code>{votePackage}</Code>
            </>
          )}
        </CardBody>
      </Card>
      <ShowRawButton obj={rawTx} />
    </Flex>
  )
}
