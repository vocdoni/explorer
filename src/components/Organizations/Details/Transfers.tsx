import {
  Box,
  Flex,
  Icon,
  IconProps,
  Link,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from '@chakra-ui/react'
import { Trans, useTranslation } from 'react-i18next'
import { generatePath, Link as RouterLink } from 'react-router-dom'
import { ReducedTextAndCopy } from '~components/Layout/CopyButton'
import { LoadingCards } from '~components/Layout/Loading'
import { RoutePath } from '~constants'
import { useAccountTransfers } from '~queries/organizations'
import { useDateFns } from '~i18n/use-date-fns'
import { BiLogInCircle, BiLogOutCircle } from 'react-icons/bi'
import { AccountData } from '@vocdoni/sdk'
import { Pagination } from '@vocdoni/chakra-components'
import { PaginationProvider, usePagination } from '@vocdoni/react-providers'
import { ContentError, NoResultsError } from '~components/Layout/ContentError'

const FromToIcon = ({ isIncoming, ...rest }: { isIncoming: boolean } & IconProps) => {
  const { t } = useTranslation()

  let icon = BiLogOutCircle
  let color = 'textAccent2B'
  let tooltip = t('organization.transfers.outgoing_tx', { defaultValue: 'Outgoing tx' })
  if (isIncoming) {
    icon = BiLogInCircle
    color = 'accent1C'
    tooltip = t('organization.transfers.incoming_tx', { defaultValue: 'Incoming tx' })
  }

  return (
    <Tooltip label={tooltip}>
      <span>
        <Icon as={icon} color={color} {...rest} />
      </span>
    </Tooltip>
  )
}

interface AccountTransfersProps {
  txCount: number | undefined
  org: AccountData
}

const AccountTransfers = (txProps: AccountTransfersProps) => {
  return (
    <PaginationProvider>
      <AccountTransfersTable {...txProps} />
    </PaginationProvider>
  )
}

const AccountTransfersTable = ({ txCount, org }: AccountTransfersProps) => {
  const { page } = usePagination()
  const { formatDistance } = useDateFns()

  const { data, isLoading, isError, error } = useAccountTransfers({
    address: org.address,
    page: page,
    options: {
      enabled: !!txCount && txCount > 0,
    },
  })

  if (txCount && !(txCount > 0)) {
    return (
      <Text>
        <Trans i18nKey={'organization.transfers.no_transfers'}>No transfers yet!</Trans>
      </Text>
    )
  }

  if (!txCount || isLoading) {
    return <LoadingCards />
  }

  if (data?.pagination.totalItems === 0) {
    return <NoResultsError />
  }

  if (isError || !data) {
    return <ContentError error={error} />
  }

  return (
    <>
      <Box overflow='auto' w='auto'>
        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th>
                  <Trans i18nKey={'organization.transfers.tx_hash'}>Tx Hash</Trans>
                </Th>
                <Th>
                  <Trans i18nKey={'organization.transfers.block'}>Block</Trans>
                </Th>
                <Th>
                  <Trans i18nKey={'organization.transfers.from_to'}>From/To</Trans>
                </Th>
                <Th>
                  <Trans i18nKey={'organization.transfers.amount'}>Amount</Trans>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.transfers.map((transfer, i) => {
                const isIncoming = transfer.to === org.address
                let fromToAddress = isIncoming ? transfer.from : transfer.to
                return (
                  <Tr key={i}>
                    <Td>
                      <Flex direction={'column'} align={'start'} gap={3}>
                        <ReducedTextAndCopy
                          breakPoint={{ base: true }}
                          color={'textAccent1'}
                          toCopy={transfer.txHash}
                          fontWeight={'normal'}
                          fontSize={'sm'}
                          to={generatePath(RoutePath.TransactionByHashOrHeight, { hashOrHeight: transfer.txHash })}
                        >
                          {transfer.txHash}
                        </ReducedTextAndCopy>

                        <Text fontWeight={100} color={'lighterText'} fontSize={'sm'}>
                          {formatDistance(new Date(transfer.timestamp), new Date())}
                        </Text>
                      </Flex>
                    </Td>
                    <Td>
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
                    </Td>
                    <Td>
                      <Flex align={'center'} gap={1}>
                        <Box>
                          <FromToIcon isIncoming={isIncoming} boxSize={5} />
                        </Box>
                        <ReducedTextAndCopy
                          breakPoint={{ base: true }}
                          color={'textAccent1'}
                          toCopy={fromToAddress}
                          fontWeight={'normal'}
                          fontSize={'md'}
                          p={1}
                          h={8}
                          to={generatePath(RoutePath.Organization, {
                            pid: fromToAddress,
                            tab: null,
                            page: null,
                          })}
                        >
                          {fromToAddress}
                        </ReducedTextAndCopy>
                      </Flex>
                    </Td>
                    <Td>{transfer.amount}</Td>
                  </Tr>
                )
              })}
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

export default AccountTransfers
