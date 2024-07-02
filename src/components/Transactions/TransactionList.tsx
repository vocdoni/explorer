import { generatePath, useNavigate, useParams } from 'react-router-dom'
import { RoutedPagination } from '~components/Pagination/Pagination'
import { RoutedPaginationProvider } from '~components/Pagination/PaginationProvider'
import { PaginationItemsPerPage, RoutePath } from '~constants'
import { LoadingCards } from '~components/Layout/Loading'
import LoadingError from '~components/Layout/LoadingError'
import { useTransactionList, useTransactionsCount } from '~queries/transactions'
import { TransactionCard } from '~components/Transactions/TransactionCard'
import { useTranslation } from 'react-i18next'
import { InputSearch } from '~components/Layout/Inputs'

export const TransactionFilter = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data, isLoading: isLoadingCount } = useTransactionsCount()

  return (
    <InputSearch
      maxW={'300px'}
      placeholder={t('transactions.search_tx')}
      onChange={(value: string) => {
        if (!data) {
          return
        }
        const num = parseInt(value)
        let page = 0 // By default return to first page
        if (!isNaN(num) && num >= 0) {
          page = Math.ceil((data - num + 1) / PaginationItemsPerPage)
        }
        navigate(generatePath(RoutePath.TransactionsList, { page: page.toString() }))
      }}
      debounceTime={500}
      type={'number'}
    />
  )
}

export const PaginatedTransactionList = () => {
  const { page }: { page?: number } = useParams()
  const { data: count, isLoading: isLoadingCount } = useTransactionsCount()

  const totalPages = Math.ceil(count / PaginationItemsPerPage)

  const currentPage = page && page > 0 ? Number(page - 1) : 0
  const { data, isLoading: isLoadingTx, isError, error } = useTransactionList({ page: currentPage })

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
