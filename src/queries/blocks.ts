import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import {
  BlockListParametersWithPagination,
  BlockListResponseWithPagination,
  ExtendedSDKClient,
} from '@vocdoni/extended-sdk'
import { useClient } from '@vocdoni/react-providers'
import { IChainTxListResponse } from '@vocdoni/sdk'
import { useChainInfo, useChainInfoOptions } from '~queries/stats'

export const useBlockList = ({
  params,
  ...options
}: {
  params: BlockListParametersWithPagination
} & Omit<UseQueryOptions<BlockListResponseWithPagination>, 'queryKey'>) => {
  const { client } = useClient<ExtendedSDKClient>()

  return useQuery({
    queryKey: ['blocks', 'list', params],
    queryFn: () => client.blockList(params),
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
} & Omit<UseQueryOptions<IChainTxListResponse>, 'queryKey'>) => {
  const { client } = useClient<ExtendedSDKClient>()

  return useQuery({
    queryKey: ['blocks', 'list', 'transactions', blockHeight, page],
    queryFn: () => client.txList({ height: blockHeight, page }),
    ...options,
  })
}
