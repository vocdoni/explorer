import { ErrTransactionNotFound, Tx } from '@vocdoni/sdk'
import { useLoaderData } from 'react-router-dom'
import { TransactionDetail as TransactionDetailView } from '~components/Transactions/Detail'

const TransactionDetail = () => {
  const tx = useLoaderData() as Tx
  if (!tx) throw new ErrTransactionNotFound()
  return <TransactionDetailView {...tx} />
}

export default TransactionDetail
