import { useParams } from 'react-router-dom'
import { RoutedPagination } from '~components/Pagination/Pagination'
import { RoutedPaginationProvider } from '~components/Pagination/PaginationProvider'
import { PaginationItemsPerPage, RoutePath } from '~constants'
import { LoadingCards } from '~src/layout/Loading'
import LoadingError from '~src/layout/LoadingError'
import { useTransactionList, useTransactionsCount } from '~queries/transactions'
import { TransactionCard } from '~components/Transactions/TransactionCard'

export const PaginatedTransactionList = () => {
  const { page }: { page?: number } = useParams()
  const { data: count, isLoading: isLoadingCount } = useTransactionsCount()

  const totalPages = Math.ceil(count / PaginationItemsPerPage)

  const { data, isLoading: isLoadingTx, isError, error } = useTransactionList({ page: Number(page || 1) })

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
