import ListPageLayout from '~components/Layout/ListPageLayout'
import { useTranslation } from 'react-i18next'
import { PaginatedTransactionList, TransactionFilter } from '~components/Transactions/TransactionList'
import { useTransactionsCount } from '~queries/transactions'
import { RefetchInterval } from '~constants'

const TransactionsList = () => {
  const { t } = useTranslation()
  const { data, isLoading } = useTransactionsCount({
    refetchInterval: RefetchInterval,
  })

  const subtitle = !isLoading && !!data ? t('transactions.tx_count', { count: data }) : ''

  return (
    <ListPageLayout
      title={t('transactions.transactions_list')}
      subtitle={subtitle}
      rightComponent={<TransactionFilter />}
    >
      <PaginatedTransactionList />
    </ListPageLayout>
  )
}

export default TransactionsList
