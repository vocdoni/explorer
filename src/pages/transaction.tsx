import { useLoaderData } from 'react-router-dom'
import { TransactionDetail as TransactionDetailView } from '~components/Transactions/Detail'
import { ErrTransactionNotFound, Tx } from '@vocdoni/sdk'

const TransactionDetail = () => {
  const tx = useLoaderData() as Tx
  if (!tx) throw new ErrTransactionNotFound()
  return <TransactionDetailView {...tx} />
}

export default TransactionDetail
