import { Link } from '@chakra-ui/react'
import { ensure0x, TransactionType, Tx } from '@vocdoni/sdk'
import { useTranslation } from 'react-i18next'
import { generatePath, Link as RouterLink } from 'react-router-dom'
import { ReducedTextAndCopy } from '~components/Layout/CopyButton'
import { DetailsGrid, GridItemProps } from '~components/Layout/DetailsGrid'
import { TransactionTypeBadge } from '~components/Transactions/TransactionCard'
import { RoutePath } from '~constants'
import { useDateFns } from '~i18n/use-date-fns'
import { useBlockToDate } from '~queries/stats'

export const TxDetailsGrid = (tx: Tx) => {
  const blockHeight = tx.txInfo.height
  const txIndex = tx.txInfo.index
  const type = tx.txInfo.type
  let subtype = ''
  if (tx.txInfo.subtype && tx.txInfo.subtype !== '' && tx.txInfo.subtype !== type) {
    subtype = tx.txInfo.subtype
  }

  const { data } = useBlockToDate({ height: blockHeight })
  const { t } = useTranslation()
  const { format } = useDateFns()
  let timestamp = ''
  if (data) {
    timestamp = format(new Date(data.date), 'PPPpp')
  }

  const txHash = ensure0x(tx.txInfo.hash)
  let txType: TransactionType | undefined = undefined
  if (tx.tx) {
    txType = Object.keys(tx.tx)[0] as TransactionType
  }

  const sharedDetails: GridItemProps[] = [
    {
      label: t('transactions.tx_type', { defaultValue: 'Transaction type' }),
      children: !!txType ? <TransactionTypeBadge transactionType={txType} /> : null,
    },
    ...(subtype
      ? [
          {
            label: t('transactions.subtype', { defaultValue: 'Subtype' }),
            children: <TransactionTypeBadge transactionType={subtype} />,
          },
        ]
      : []),
    ...(timestamp
      ? [
          {
            label: t('blocks.timestamp', { defaultValue: 'Timestamp' }),
            children: timestamp,
          },
        ]
      : []),
    {
      label: t('transactions.tx_hash', { defaultValue: 'Transaction hash' }),
      children: (
        <ReducedTextAndCopy
          breakPoint={{ base: true, lg: false }}
          p={0}
          color={'textAccent1'}
          toCopy={txHash}
          fontWeight={'normal'}
          h={0}
          fontSize={'md'}
        >
          {txHash}
        </ReducedTextAndCopy>
      ),
    },
    {
      label: t('transactions.block', { defaultValue: 'Block' }),
      children: (
        <Link
          as={RouterLink}
          to={generatePath(RoutePath.Block, { height: blockHeight.toString(), tab: null, page: null })}
        >
          {blockHeight}
        </Link>
      ),
    },
    {
      label: t('transactions.tx_index', { defaultValue: 'Transaction index' }),
      children: txIndex,
    },
  ]

  return <DetailsGrid details={sharedDetails} />
}
