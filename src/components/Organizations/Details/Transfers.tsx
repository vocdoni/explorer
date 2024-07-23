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
import { generatePath, Link as RouterLink, useParams } from 'react-router-dom'
import { ReducedTextAndCopy } from '~components/Layout/CopyButton'
import { LoadingCards } from '~components/Layout/Loading'
import { RoutePath } from '~constants'
import { useAccountTransfers } from '~queries/organizations'
import { retryUnlessNotFound } from '~utils/queries'
import { useDateFns } from '~i18n/use-date-fns'
import { BiLogInCircle, BiLogOutCircle } from 'react-icons/bi'
import { AccountData } from '@vocdoni/sdk'

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

const AccountTransfers = ({ txCount, org }: { txCount: number | undefined; org: AccountData }) => {
  const { page } = useParams()
  const { formatDistance } = useDateFns()

  const { data, isLoading } = useAccountTransfers({
    address: org.address,
    page: Number(page) - 1 || 0,
    options: {
      enabled: !!txCount && txCount > 0,
      retry: retryUnlessNotFound,
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

  let mergedTransfers = []
  if (data) {
    mergedTransfers = [...data.transfers.received, ...data.transfers.sent]
    mergedTransfers.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    // Todo: put this out of the when https://github.com/vocdoni/vocdoni-sdk/pull/400 is merged
    // Now is inside the if to infer the type properly
    return (
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
              {mergedTransfers.map((transfer, i) => {
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
                          // todo: implement go to tx by its hash
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
                        to={generatePath(RoutePath.Block, { height: transfer.height.toString(), page: null })}
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
                          to={generatePath(RoutePath.Organization, { pid: fromToAddress, page: null })}
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
    )
  }
  // Todo: put this out of the when https://github.com/vocdoni/vocdoni-sdk/pull/400 is merged
  return <></>
}

export default AccountTransfers
