import { Text } from '@chakra-ui/react'
import { keepPreviousData } from '@tanstack/react-query'
import { IBlockTransactionsResponse, IChainTxListResponse } from '@vocdoni/sdk'
import { Trans, useTranslation } from 'react-i18next'
import { generatePath, useNavigate, useParams } from 'react-router-dom'
import { PopoverInputSearch } from '~components/Layout/Inputs'
import { LoadingCards } from '~components/Layout/Loading'
import LoadingError from '~components/Layout/LoadingError'
import { RoutedPaginationProvider } from '~components/Pagination/PaginationProvider'
import { RoutedPagination } from '~components/Pagination/RoutedPagination'
import { TransactionCard } from '~components/Transactions/TransactionCard'
import { PaginationItemsPerPage, RoutePath } from '~constants'
import { useBlockTransactions } from '~queries/blocks'
import { useTransactionList, useTransactionsCount } from '~queries/transactions'
import { retryUnlessNotFound } from '~utils/queries'
import { useCallback, useState } from 'react'
import { isValidHash } from '~utils/strings'

export const TransactionFilter = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data } = useTransactionsCount()
  const [txNumberOrHash, setTxNumberOrHash] = useState('')

  const goTo = useCallback(() => {
    if (!data) {
      throw new Error(t('transactions.invalid_tx_count', { defaultValue: 'Invalid chain transactions count' }))
    }
    const num = parseInt(txNumberOrHash)
    // Throw an error if the input is not a valid hash or num is not a number and is not between 0 and data
    if (!isValidHash(txNumberOrHash) && (isNaN(num) || num <= 0 || num > data)) {
      throw new Error(t('transactions.invalid_tx_search', { defaultValue: 'Must to be a valid tx hash or index' }))
    }
    const hashOrHeight = isValidHash(txNumberOrHash) ? txNumberOrHash : num.toString()
    navigate(generatePath(RoutePath.TransactionByHashOrHeight, { hashOrHeight }))
  }, [txNumberOrHash, data])

  return (
    <PopoverInputSearch
      input={{
        placeholder: t('transactions.go_to_tx', { defaultValue: 'Go to transaction' }),
        onChange: (value: string) => {
          setTxNumberOrHash(value)
        },
      }}
      button={{
        onClick: goTo,
      }}
    />
  )
}

export const PaginatedTransactionList = () => {
  const { page }: { page?: number } = useParams()
  const { data: count, isLoading: isLoadingCount } = useTransactionsCount()

  const totalPages = Math.ceil(count / PaginationItemsPerPage)

  const currentPage = page && page > 0 ? Number(page - 1) : 0
  const {
    data,
    isLoading: isLoadingTx,
    isError,
    error,
  } = useTransactionList({
    page: currentPage,
    placeholderData: keepPreviousData,
    retry: retryUnlessNotFound,
  })

  const isLoading = isLoadingCount || isLoadingTx

  return <TransactionsList isLoading={isLoading} data={data} isError={isError} error={error} totalPages={totalPages} />
}

/**
 * Get transaction list by block height
 * @constructor
 */
export const BlockTransactionsList = ({ blockHeight, totalTxs }: { blockHeight: number; totalTxs: number }) => {
  const totalPages = Math.ceil(totalTxs / PaginationItemsPerPage)
  const { page }: { page?: number } = useParams()
  const currentPage = page && page > 0 ? Number(page - 1) : 0

  const { data, isLoading, isError, error } = useBlockTransactions({
    blockHeight,
    page: currentPage,
    placeholderData: keepPreviousData,
    retry: retryUnlessNotFound,
    enabled: totalTxs > 0,
  })

  if (totalTxs <= 0) {
    return (
      <Text>
        <Trans i18nKey={'blocks.no_txs_on_block'}>There are no transactions.</Trans>
      </Text>
    )
  }

  return <TransactionsList isLoading={isLoading} data={data} isError={isError} error={error} totalPages={totalPages} />
}

const TransactionsList = ({
  isLoading,
  data,
  isError,
  error,
  totalPages,
}: {
  isLoading: boolean
  data: IChainTxListResponse | IBlockTransactionsResponse | undefined
  isError: boolean
  error: Error | null
  totalPages: number
}) => {
  return (
    <>
      {isLoading && <LoadingCards spacing={4} />}
      {!data || data?.transactions.length === 0 || (isError && <LoadingError error={error} />)}
      {data && data.transactions.length > 0 && (
        <RoutedPaginationProvider totalPages={totalPages} path={RoutePath.TransactionsList}>
          {data.transactions.map((tx, i) => (
            <TransactionCard
              key={i}
              {...tx}
              blockHeight={(data as IBlockTransactionsResponse)?.blockNumber ?? tx.blockHeight} // If is IBlockTransactionsResponse the block height is not on tx info
            />
          ))}
          <RoutedPagination />
        </RoutedPaginationProvider>
      )}
    </>
  )
}
