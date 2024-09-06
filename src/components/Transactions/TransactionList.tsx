import { Flex } from '@chakra-ui/react'
import { keepPreviousData } from '@tanstack/react-query'
import { RoutedPaginationProvider, useRoutedPagination } from '@vocdoni/react-providers'
import { IChainTxListResponse } from '@vocdoni/sdk'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { generatePath, useNavigate } from 'react-router-dom'
import { PaginatedAsyncList } from '~components/Layout/AsyncList'
import { PopoverInputSearch } from '~components/Layout/Inputs'
import { TransactionCard } from '~components/Transactions/TransactionCard'
import { RoutePath } from '~constants'
import { useBlockTransactions } from '~queries/blocks'
import { useTransactionList, useTransactionsCount } from '~queries/transactions'
import { isValidHash } from '~utils/strings'

export const TransactionFilter = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data } = useTransactionsCount()
  const [txHash, setTxHash] = useState('')

  const goTo = useCallback(() => {
    if (!data) {
      throw new Error(t('transactions.invalid_tx_count', { defaultValue: 'Invalid chain transactions count' }))
    }
    // Throw an error if the input is not a valid hash or num is not a number and is not between 0 and data
    if (!isValidHash(txHash)) {
      throw new Error(t('transactions.invalid_tx_search', { defaultValue: 'Must to be a valid tx hash' }))
    }
    navigate(generatePath(RoutePath.TransactionByHash, { hash: txHash, tab: null }))
  }, [data, txHash, navigate, t])

  return (
    <PopoverInputSearch
      input={{
        placeholder: t('transactions.go_to_tx', { defaultValue: 'Go to transaction' }),
        onChange: (value: string) => {
          setTxHash(value)
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
  const { isLoading: isLoadingCount } = useTransactionsCount()

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
    <Flex direction={'column'} gap={4}>
      <TransactionsListCards isLoading={isLoading} data={data} isError={isError} error={error} height={blockHeight} />
    </Flex>
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
  const { t } = useTranslation()

  return (
    <PaginatedAsyncList
      isLoading={isLoading}
      elements={data?.transactions}
      isError={isError}
      error={error}
      noResultsMsg={t('blocks.no_txs_on_block', { defaultValue: 'There are no transactions' })}
      pagination={data?.pagination}
      component={({ element }) => (
        <TransactionCard
          {...element}
          height={height ?? element.height} // If is IBlockTransactionsResponse the block height is not on tx info
        />
      )}
      skeletonProps={{ spacing: 4 }}
    />
  )
}
