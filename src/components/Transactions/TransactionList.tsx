import { Text } from '@chakra-ui/react'
import { keepPreviousData } from '@tanstack/react-query'
import { IChainTxListResponse } from '@vocdoni/sdk'
import { Trans, useTranslation } from 'react-i18next'
import { generatePath, useNavigate } from 'react-router-dom'
import { PopoverInputSearch } from '~components/Layout/Inputs'
import { LoadingCards } from '~components/Layout/Loading'
import { RoutedPaginationProvider, useRoutedPagination } from '~components/Pagination/PaginationProvider'
import { RoutedPagination } from '~components/Pagination/RoutedPagination'
import { TransactionCard } from '~components/Transactions/TransactionCard'
import { PaginationItemsPerPage, RoutePath } from '~constants'
import { useBlockTransactions } from '~queries/blocks'
import { useTransactionList, useTransactionsCount } from '~queries/transactions'
import { useCallback, useState } from 'react'
import { isValidHash } from '~utils/strings'
import { ContentError, NoResultsError } from '~components/Layout/ContentError'

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
  return (
    <RoutedPaginationProvider path={RoutePath.TransactionsList}>
      <TransactionsList />
    </RoutedPaginationProvider>
  )
}
const TransactionsList = () => {
  const { page }: { page?: number } = useRoutedPagination()
  const { data: count, isLoading: isLoadingCount } = useTransactionsCount()

  const totalPages = Math.ceil(count / PaginationItemsPerPage)

  const {
    data,
    isLoading: isLoadingTx,
    isError,
    error,
  } = useTransactionList({
    params: {
      page,
    },
    placeholderData: keepPreviousData,
  })

  const isLoading = isLoadingCount || isLoadingTx

  return <TransactionsListCards isLoading={isLoading} data={data} isError={isError} error={error} />
}

interface ITxListByBlock {
  blockHeight: number
  totalTxs: number
}

export const PaginatedBlockTransactionsList = (params: ITxListByBlock) => {
  return (
    <RoutedPaginationProvider path={RoutePath.TransactionsList}>
      <TransactionsListByBlock {...params} />
    </RoutedPaginationProvider>
  )
}

const TransactionsListByBlock = ({ blockHeight, totalTxs }: ITxListByBlock) => {
  const { page }: { page?: number } = useRoutedPagination()
  const currentPage = page && page > 0 ? Number(page - 1) : 0

  const { data, isLoading, isError, error } = useBlockTransactions({
    blockHeight,
    page: currentPage,
    placeholderData: keepPreviousData,
    enabled: totalTxs > 0,
  })

  return (
    <TransactionsListCards isLoading={isLoading} data={data} isError={isError} error={error} height={blockHeight} />
  )
}

const TransactionsListCards = ({
  isLoading,
  data,
  isError,
  error,
  height,
}: {
  isLoading: boolean
  data: IChainTxListResponse | undefined
  isError: boolean
  error: Error | null
  height?: number
}) => {
  if (!data || (data && data.transactions.length <= 0)) {
    return (
      <Text>
        <Trans i18nKey={'blocks.no_txs_on_block'}>There are no transactions.</Trans>
      </Text>
    )
  }

  if (isLoading) {
    return <LoadingCards spacing={4} />
  }

  if (data?.pagination.totalItems === 0) {
    return <NoResultsError />
  }

  if (isError || !data) {
    return <ContentError error={error} />
  }

  return (
    <>
      {data.transactions.map((tx, i) => (
        <TransactionCard
          key={i}
          {...tx}
          blockHeight={height ?? tx.blockHeight} // If is IBlockTransactionsResponse the block height is not on tx info
        />
      ))}
      <RoutedPagination pagination={data.pagination} />
    </>
  )
}
