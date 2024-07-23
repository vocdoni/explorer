import { Box, Flex, Link, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react'
import { Trans } from 'react-i18next'
import { LoadingCards } from '~components/Layout/Loading'
import { useDateFns } from '~i18n/use-date-fns'
import { AccountData, TransactionType } from '@vocdoni/sdk'
import { PaginationProvider, usePagination } from '~components/Pagination/PaginationProvider'
import { Pagination } from '~components/Pagination/Pagination'
import { useAccountFees } from '~queries/organizations'
import { retryUnlessNotFound } from '~utils/queries'
import LoadingError from '~components/Layout/LoadingError'
import { TransactionTypeBadge } from '~components/Transactions/TransactionCard'
import { generatePath, Link as RouterLink } from 'react-router-dom'
import { RoutePath } from '~constants'

const AccountFees = (org: { org: AccountData }) => {
  return (
    <PaginationProvider>
      <AccountFeesTable {...org} />
    </PaginationProvider>
  )
}

const AccountFeesTable = ({ org }: { org: AccountData }) => {
  const { page } = usePagination()
  const { formatDistance } = useDateFns()

  const { data, isLoading, isError, error } = useAccountFees({
    address: org.address,
    page: Number(page) - 1 || 0,
    options: {
      retry: retryUnlessNotFound,
    },
  })

  if (isLoading) {
    return <LoadingCards />
  }

  if (isError || !data) {
    return <LoadingError error={error} />
  }

  if (!data.fees.length) {
    return (
      <Text>
        <Trans i18nKey={'organization.fees.no_fees'}>No fees yet!</Trans>
      </Text>
    )
  }

  return (
    <>
      <Box overflow='auto' w='auto'>
        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th>
                  <Trans i18nKey={'organization.fees.tx_type'}>Tx Type</Trans>
                </Th>
                <Th>
                  <Trans i18nKey={'organization.transfers.block'}>Block</Trans>
                </Th>
                <Th>
                  <Trans i18nKey={'organization.fees.cost'}>Cost</Trans>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.fees.map((fee, i) => (
                <Tr key={i}>
                  <Td>
                    <Flex direction={'column'} align={'start'} gap={3}>
                      <TransactionTypeBadge transactionType={fee.txType as TransactionType} />
                      <Text fontWeight={100} color={'lighterText'} fontSize={'sm'}>
                        {formatDistance(new Date(fee.timestamp), new Date())}
                      </Text>
                    </Flex>
                  </Td>
                  <Td>
                    <Link
                      as={RouterLink}
                      to={generatePath(RoutePath.Block, { height: fee.height.toString(), page: null })}
                    >
                      {fee.height}
                    </Link>
                  </Td>
                  <Td>{fee.cost}</Td>
                </Tr>
              ))}
              {/*{mergedTransfers.map((transfer, i) => {*/}
              {/*  const isIncoming = transfer.to === org.address*/}
              {/*  let fromToAddress = isIncoming ? transfer.from : transfer.to*/}
              {/*  return (*/}
              {/*    <Tr key={i}>*/}
              {/*      <Td>*/}
              {/*        <Flex direction={'column'} align={'start'} gap={3}>*/}
              {/*          <ReducedTextAndCopy*/}
              {/*            breakPoint={{ base: true }}*/}
              {/*            color={'textAccent1'}*/}
              {/*            toCopy={transfer.txHash}*/}
              {/*            fontWeight={'normal'}*/}
              {/*            fontSize={'sm'}*/}
              {/*            // todo: implement go to tx by its hash*/}
              {/*          >*/}
              {/*            {transfer.txHash}*/}
              {/*          </ReducedTextAndCopy>*/}

              {/*          <Text fontWeight={100} color={'lighterText'} fontSize={'sm'}>*/}
              {/*            {formatDistance(new Date(transfer.timestamp), new Date())}*/}
              {/*          </Text>*/}
              {/*        </Flex>*/}
              {/*      </Td>*/}
              {/*      <Td>*/}
              {/*        <Link*/}
              {/*          as={RouterLink}*/}
              {/*          to={generatePath(RoutePath.Block, { height: transfer.height.toString(), page: null })}*/}
              {/*        >*/}
              {/*          {transfer.height}*/}
              {/*        </Link>*/}
              {/*      </Td>*/}
              {/*      <Td>*/}
              {/*        <Flex align={'center'} gap={1}>*/}
              {/*          <Box>*/}
              {/*            <FromToIcon isIncoming={isIncoming} boxSize={5} />*/}
              {/*          </Box>*/}
              {/*          <ReducedTextAndCopy*/}
              {/*            breakPoint={{ base: true }}*/}
              {/*            color={'textAccent1'}*/}
              {/*            toCopy={fromToAddress}*/}
              {/*            fontWeight={'normal'}*/}
              {/*            fontSize={'md'}*/}
              {/*            p={1}*/}
              {/*            h={8}*/}
              {/*            to={generatePath(RoutePath.Organization, { pid: fromToAddress, page: null })}*/}
              {/*          >*/}
              {/*            {fromToAddress}*/}
              {/*          </ReducedTextAndCopy>*/}
              {/*        </Flex>*/}
              {/*      </Td>*/}
              {/*      <Td>{transfer.amount}</Td>*/}
              {/*    </Tr>*/}
              {/*  )*/}
              {/*})}*/}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
      <Box pt={4}>
        <Pagination />
      </Box>
    </>
  )
}

export default AccountFees
