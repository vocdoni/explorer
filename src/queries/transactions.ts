import { useChainInfo, useChainInfoOptions } from '~queries/stats'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { IChainTxListResponse } from '@vocdoni/sdk'
import { useClient } from '@vocdoni/react-providers'
import { ExtendedSDKClient } from '@vocdoni/extended-sdk'

export const useTransactionList = ({
  page,
  ...options
}: {
  page: number
} & Omit<UseQueryOptions<IChainTxListResponse>, 'queryKey'>) => {
  const { client } = useClient<ExtendedSDKClient>()

  return useQuery({
    queryKey: ['transactions', 'list', page],
    queryFn: () => client.txList(page),
    ...options,
  })
}

export const useTransactionsCount = (options?: useChainInfoOptions) => {
  const { data, ...rest } = useChainInfo({ ...options })
  const count = data?.transactionCount || 0
  return { data: count, ...rest }
}
