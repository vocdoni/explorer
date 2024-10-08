import { Flex, Link, Skeleton, Td, Text, Th, Thead, Tr } from '@chakra-ui/react'
import { PaginationProvider, useOrganization, usePagination } from '@vocdoni/react-providers'
import { Fee, TransactionType } from '@vocdoni/sdk'
import { Trans } from 'react-i18next'
import { generatePath, Link as RouterLink } from 'react-router-dom'
import { PaginatedAsyncTable } from '~components/Layout/AsyncList'
import { TransactionTypeBadge } from '~components/Transactions/TransactionCard'
import { RoutePath } from '~constants'
import { useDateFns } from '~i18n/use-date-fns'
import { useAccountFees } from '~queries/accounts'
import { generateListStub, PaginationStub } from '~utils/stubs'

const AccountFees = () => (
  <PaginationProvider>
    <AccountFeesTable />
  </PaginationProvider>
)

const AccountFeesTable = () => {
  const { page } = usePagination()
  const { organization } = useOrganization()

  const feesCount = organization?.feesCount ?? 0

  const { data, isError, error, isPlaceholderData } = useAccountFees({
    params: {
      accountId: organization?.address as string,
      page,
    },
    options: {
      enabled: feesCount > 0,
      placeholderData: {
        fees: generateListStub<Fee>({
          cost: 12,
          from: 'string',
          height: 12,
          reference: 'string',
          timestamp: '2024-08-28T15:20:06Z',
          txType: 'string',
        }),
        pagination: PaginationStub,
      },
    },
  })

  if (!organization) return null

  return (
    <PaginatedAsyncTable
      isLoading={isPlaceholderData}
      elements={data?.fees}
      isError={isError}
      error={error}
      pagination={data?.pagination}
      component={({ element }) => <AccountFeesRow fee={element} isLoading={isPlaceholderData} />}
      skeletonProps={{ skeletonCircle: true }}
      routedPagination={false}
      th={
        <Thead>
          <Tr>
            <Th>
              <Trans i18nKey={'account.fees.tx_type'}>Tx Type</Trans>
            </Th>
            <Th>
              <Trans i18nKey={'account.transfers.block'}>Block</Trans>
            </Th>
            <Th>
              <Trans i18nKey={'account.fees.cost'}>Cost</Trans>
            </Th>
          </Tr>
        </Thead>
      }
    />
  )
}

const AccountFeesRow = ({ fee, isLoading }: { fee: Fee; isLoading: boolean }) => {
  const { formatDistance } = useDateFns()

  return (
    <Tr>
      <Td>
        <Flex direction={'column'} align={'start'} gap={3}>
          <Skeleton isLoaded={!isLoading} fitContent>
            <TransactionTypeBadge transactionType={fee.txType as TransactionType} />
          </Skeleton>
          <Skeleton isLoaded={!isLoading} fitContent>
            <Text fontWeight={100} color={'lighterText'} fontSize={'sm'}>
              {formatDistance(new Date(fee.timestamp), new Date())}
            </Text>
          </Skeleton>
        </Flex>
      </Td>
      <Td>
        <Skeleton isLoaded={!isLoading} fitContent>
          <Link
            as={RouterLink}
            to={generatePath(RoutePath.Block, { height: fee.height.toString(), tab: null, page: null })}
          >
            {fee.height}
          </Link>
        </Skeleton>
      </Td>
      <Td>
        <Skeleton isLoaded={!isLoading} fitContent>
          {fee.cost}
        </Skeleton>
      </Td>
    </Tr>
  )
}

export default AccountFees
