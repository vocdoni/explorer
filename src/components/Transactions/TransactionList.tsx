import { keepPreviousData } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { generatePath, useNavigate, useParams } from 'react-router-dom'
import { PopoverInputSearch } from '~components/Layout/Inputs'
import { LoadingCards } from '~components/Layout/Loading'
import LoadingError from '~components/Layout/LoadingError'
import { RoutedPaginationProvider } from '~components/Pagination/PaginationProvider'
import { RoutedPagination } from '~components/Pagination/RoutedPagination'
import { TransactionCard } from '~components/Transactions/TransactionCard'
import { PaginationItemsPerPage, RoutePath } from '~constants'
import { useTransactionList, useTransactionsCount } from '~queries/transactions'
import { retryUnlessNotFound } from '~utils/queries'

export const TransactionFilter = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data } = useTransactionsCount()
  const [txNumber, setTxNumber] = useState('')

  const goTo = useCallback(() => {
    if (!data) {
      return
    }
    const num = parseInt(txNumber)
    let page = 0 // By default return to first page
    if (!isNaN(num) && num >= 0) {
      page = Math.ceil((data - num + 1) / PaginationItemsPerPage)
    }
    navigate(generatePath(RoutePath.TransactionsList, { page: page.toString() }))
  }, [txNumber, data])

  return (
    <PopoverInputSearch
      input={{
        placeholder: t('transactions.go_to_tx', { defaultValue: 'Go to transaction' }),
        onChange: (value: string) => {
          setTxNumber(value)
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

  return (
    <>
      {isLoading && <LoadingCards />}
      {!data || data?.transactions.length === 0 || (isError && <LoadingError error={error} />)}
      {data && data.transactions.length > 0 && (
        <RoutedPaginationProvider totalPages={totalPages} path={RoutePath.TransactionsList}>
          {data.transactions.map((tx, i) => (
            <TransactionCard key={i} {...tx} />
          ))}
          <RoutedPagination />
        </RoutedPaginationProvider>
      )}
    </>
  )
}
