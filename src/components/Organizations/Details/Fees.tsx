import { Box, Flex, Link, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react'
import { Trans } from 'react-i18next'
import { LoadingCards } from '~components/Layout/Loading'
import { useDateFns } from '~i18n/use-date-fns'
import { AccountData, TransactionType } from '@vocdoni/sdk'
import { PaginationProvider, usePagination } from '~components/Pagination/PaginationProvider'
import { Pagination } from '~components/Pagination/Pagination'
import { useAccountFees } from '~queries/organizations'
import { TransactionTypeBadge } from '~components/Transactions/TransactionCard'
import { generatePath, Link as RouterLink } from 'react-router-dom'
import { RoutePath } from '~constants'
import { ContentError, NoResultsError } from '~components/Layout/ContentError'

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
    params: {
      accountId: org.address,
      page,
    },
  })

  if (isLoading) {
    return <LoadingCards />
  }

  if (data?.pagination.totalItems === 0) {
    return <NoResultsError />
  }

  if (isError || !data) {
    return <ContentError error={error} />
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
                      to={generatePath(RoutePath.Block, { height: fee.height.toString(), tab: null, page: null })}
                    >
                      {fee.height}
                    </Link>
                  </Td>
                  <Td>{fee.cost}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
      <Box pt={4}>
        <Pagination pagination={data.pagination} />
      </Box>
    </>
  )
}

export default AccountFees
