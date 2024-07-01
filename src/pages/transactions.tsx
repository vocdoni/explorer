import ListPageLayout from '~src/layout/ListPageLayout'
import { useTranslation } from 'react-i18next'
import { PaginatedTransactionList, TransactionFilter } from '~components/Transactions/TransactionList'
import { useTransactionsCount } from '~queries/transactions'

const TransactionsList = () => {
  const { t } = useTranslation()
  const { data, isLoading } = useTransactionsCount()

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
