import { useChainInfo, useChainInfoOptions } from '~queries/stats'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { FetchTransactionsParametersWithPagination, IChainTxListResponse } from '@vocdoni/sdk'
import { useClient } from '@vocdoni/react-providers'
import { ExtendedSDKClient } from '@vocdoni/extended-sdk'

export const useTransactionList = ({
  params,
  ...options
}: {
  params: Partial<Omit<FetchTransactionsParametersWithPagination, 'height'>>
} & Omit<UseQueryOptions<IChainTxListResponse>, 'queryKey'>) => {
  const { client } = useClient<ExtendedSDKClient>()

  return useQuery({
    queryKey: ['transactions', 'list', params],
    queryFn: () => client.txList(params),
    ...options,
  })
}

export const useTransactionsCount = (options?: useChainInfoOptions) => {
  const { data, ...rest } = useChainInfo({ ...options })
  const count = data?.transactionCount || 0
  return { data: count, ...rest }
}
