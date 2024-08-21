import { Flex, Heading, StackDivider, Tab, TabList, TabPanel, TabPanels, Text, VStack } from '@chakra-ui/react'
import { Tx } from '@vocdoni/sdk'
import { Trans } from 'react-i18next'
import { RouteParamsTabs } from '~components/Layout/RouteParamsTabs'
import { RawContentBox } from '~components/Layout/ShowRawButton'
import { SpecificTxDetails } from '~components/Transactions/TxDetails/SpecificTxDetails'
import { TxDetailsGrid } from '~components/Transactions/TxDetails/TxDetails'
import { useDateFns } from '~i18n/use-date-fns'
import { useBlockToDate } from '~queries/stats'
import { objectB64StringsToHex } from '~utils/objects'
import { RoutePath } from '~constants'

export const TransactionDetail = (tx: Tx) => {
  const { data } = useBlockToDate({ height: tx.txInfo.blockHeight })
  const { formatDistance } = useDateFns()

  let createdOn = ''
  if (data) {
    createdOn = formatDistance(new Date(data.date), new Date())
  }

  // For some reason, response payload converted transactions have some
  // values into base64 string. This values, on the interface declaration are
  // `Uint8Array`, but on JSON decoding are treated as 'strings'.
  // So is a little bit tricky to know if a payload value have to be
  // converted to a b64 or not. Probably reflection could help with that. BTW
  // is solved checking regex.

  const rawTx = JSON.parse(JSON.stringify(tx))
  objectB64StringsToHex(rawTx, ['txInfo'])

  return (
    <Flex direction={'column'} mt={'40px'} gap={6}>
      <VStack align='start'>
        <Heading isTruncated wordBreak='break-word' mb={0}>
          <Trans i18nKey={'transactions.tx_title'} number={tx.txInfo.transactionNumber}>
            Transaction #{{ number: tx.txInfo.transactionNumber }}
          </Trans>
        </Heading>
        {createdOn && (
          <Text mt={0} fontWeight={'bold'} color={'lighterText'}>
            <Trans i18nKey={'transactions.created_on'} createdOn={createdOn}>
              Created {{ createdOn }}
            </Trans>
          </Text>
        )}
      </VStack>
      <RouteParamsTabs path={RoutePath.Transaction} isLazy>
        <TabList display='flex' flexWrap='wrap'>
          <Tab>
            <Trans i18nKey={'process.tab_details'}>Details</Trans>
          </Tab>
          <Tab>
            <Trans i18nKey={'raw'}>Raw</Trans>
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <VStack divider={<StackDivider borderColor='gray.200' />} spacing={4} align='stretch'>
              <TxDetailsGrid {...tx} />
              <SpecificTxDetails rawTx={rawTx} tx={tx} />
            </VStack>
          </TabPanel>
          <TabPanel>
            <RawContentBox obj={rawTx} />
          </TabPanel>
        </TabPanels>
      </RouteParamsTabs>
    </Flex>
  )
}
