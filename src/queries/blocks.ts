import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { BlockError, ExtendedSDKClient } from '@vocdoni/extended-sdk'
import { useClient } from '@vocdoni/react-providers'
import { IBlockTransactionsResponse, IChainBlockInfoResponse } from '@vocdoni/sdk'
import { useChainInfo, useChainInfoOptions } from '~queries/stats'

export const useBlockList = ({
  from,
  listSize,
  ...options
}: {
  from: number
  listSize?: number
} & Omit<UseQueryOptions<Array<IChainBlockInfoResponse | BlockError>>, 'queryKey'>) => {
  const { client } = useClient<ExtendedSDKClient>()

  return useQuery({
    queryKey: ['blocks', 'list', from, listSize],
    queryFn: () => client.blockList(from, listSize),
    ...options,
  })
}

export const useBlocksHeight = (options?: useChainInfoOptions) => {
  const { data, ...rest } = useChainInfo({ ...options })
  const height = data?.height
  return { data: height, ...rest }
}

export const useBlockTransactions = ({
  blockHeight,
  page,
  ...options
}: {
  blockHeight: number
  page: number
} & Omit<UseQueryOptions<IBlockTransactionsResponse>, 'queryKey'>) => {
  const { client } = useClient<ExtendedSDKClient>()

  return useQuery({
    queryKey: ['blocks', 'list', 'transactions', blockHeight, page],
    queryFn: () => client.blockTransactions(blockHeight, page),
    ...options,
  })
}
