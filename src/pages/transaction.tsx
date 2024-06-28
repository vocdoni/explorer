import { useLoaderData } from 'react-router-dom'
import { TransactionDetail as TransactionDetailView } from '~components/Transactions/Detail'
import { Tx } from '@vocdoni/sdk'

const TransactionDetail = () => {
  const tx = useLoaderData() as Tx
  return <TransactionDetailView {...tx} />
}

export default TransactionDetail
