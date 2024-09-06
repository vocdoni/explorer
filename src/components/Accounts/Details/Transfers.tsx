import { Box, Flex, Icon, IconProps, Link, Skeleton, Td, Text, Th, Thead, Tooltip, Tr } from '@chakra-ui/react'
import { PaginationProvider, useOrganization, usePagination } from '@vocdoni/react-providers'
import { AccountData, ITransfer } from '@vocdoni/sdk'
import { formatDistance } from 'date-fns'
import { Trans, useTranslation } from 'react-i18next'
import { BiLogInCircle, BiLogOutCircle } from 'react-icons/bi'
import { generatePath, Link as RouterLink } from 'react-router-dom'
import { PaginatedAsyncTable } from '~components/Layout/AsyncList'
import { ReducedTextAndCopy } from '~components/Layout/CopyButton'
import { RoutePath } from '~constants'
import { useAccountTransfers } from '~queries/accounts'
import { generateListStub, PaginationStub } from '~utils/stubs'

const FromToIcon = ({ isIncoming, ...rest }: { isIncoming: boolean } & IconProps) => {
  const { t } = useTranslation()

  let icon = BiLogOutCircle
  let color = 'textAccent2B'
  let tooltip = t('account.transfers.outgoing_tx', { defaultValue: 'Outgoing tx' })
  if (isIncoming) {
    icon = BiLogInCircle
    color = 'accent1C'
    tooltip = t('account.transfers.incoming_tx', { defaultValue: 'Incoming tx' })
  }

  return (
    <Tooltip label={tooltip}>
      <span>
        <Icon as={icon} color={color} {...rest} />
      </span>
    </Tooltip>
  )
}

const AccountTransfers = () => (
  <PaginationProvider>
    <AccountTransfersTable />
  </PaginationProvider>
)

const AccountTransfersTable = () => {
  const { page } = usePagination()
  const { organization } = useOrganization()

  const txCount = organization?.transfersCount ?? 0

  const { data, isError, error, isPlaceholderData } = useAccountTransfers({
    address: organization?.address as string,
    page: page,
    options: {
      enabled: !!organization && txCount > 0,
      placeholderData: {
        transfers: generateListStub<ITransfer>({
          amount: 12,
          from: 'string',
          height: 12,
          timestamp: '2024-08-28T15:20:06Z',
          to: 'string',
          txHash: 'string',
        }),
        pagination: PaginationStub,
      },
    },
  })

  if (!organization) return null

  return (
    <PaginatedAsyncTable
      isLoading={isPlaceholderData}
      elements={data?.transfers}
      isError={isError}
      error={error}
      pagination={data?.pagination}
      component={({ element }) => (
        <TransfersRow transfer={element} organization={organization} isLoading={isPlaceholderData} />
      )}
      skeletonProps={{ skeletonCircle: true }}
      routedPagination={false}
      th={
        <Thead>
          <Tr>
            <Th>
              <Trans i18nKey={'account.transfers.tx_hash'}>Tx Hash</Trans>
            </Th>
            <Th>
              <Trans i18nKey={'account.transfers.block'}>Block</Trans>
            </Th>
            <Th>
              <Trans i18nKey={'account.transfers.from_to'}>From/To</Trans>
            </Th>
            <Th>
              <Trans i18nKey={'account.transfers.amount'}>Amount</Trans>
            </Th>
          </Tr>
        </Thead>
      }
    />
  )
}

const TransfersRow = ({
  transfer,
  organization,
  isLoading,
}: {
  transfer: ITransfer
  organization: AccountData
  isLoading: boolean
}) => {
  const isIncoming = transfer.to === organization.address
  let fromToAddress = isIncoming ? transfer.from : transfer.to

  return (
    <Tr>
      <Td>
        <Flex direction={'column'} align={'start'} gap={3}>
          <Skeleton isLoaded={!isLoading} fitContent>
            <ReducedTextAndCopy
              breakPoint={{ base: true }}
              color={'textAccent1'}
              toCopy={transfer.txHash}
              fontWeight={'normal'}
              fontSize={'sm'}
              to={generatePath(RoutePath.TransactionByHash, { hash: transfer.txHash, tab: null })}
            >
              {transfer.txHash}
            </ReducedTextAndCopy>
          </Skeleton>
          <Skeleton isLoaded={!isLoading} fitContent>
            <Text fontWeight={100} color={'lighterText'} fontSize={'sm'}>
              {formatDistance(new Date(transfer.timestamp), new Date())}
            </Text>
          </Skeleton>
        </Flex>
      </Td>
      <Td>
        <Skeleton isLoaded={!isLoading} fitContent>
          <Link
            as={RouterLink}
            to={generatePath(RoutePath.Block, {
              height: transfer.height.toString(),
              tab: null,
              page: null,
            })}
          >
            {transfer.height}
          </Link>
        </Skeleton>
      </Td>
      <Td>
        <Flex align={'center'} gap={1}>
          <Skeleton isLoaded={!isLoading} fitContent>
            <Box>
              <FromToIcon isIncoming={isIncoming} boxSize={5} />
            </Box>
          </Skeleton>
          <Skeleton isLoaded={!isLoading} fitContent>
            <ReducedTextAndCopy
              breakPoint={{ base: true }}
              color={'textAccent1'}
              toCopy={fromToAddress}
              fontWeight={'normal'}
              fontSize={'md'}
              p={1}
              h={8}
              to={generatePath(RoutePath.Account, {
                pid: fromToAddress,
                tab: null,
                page: null,
              })}
            >
              {fromToAddress}
            </ReducedTextAndCopy>
          </Skeleton>
        </Flex>
      </Td>
      <Td>
        <Skeleton isLoaded={!isLoading} fitContent>
          {transfer.amount}
        </Skeleton>
      </Td>
    </Tr>
  )
}

export default AccountTransfers
