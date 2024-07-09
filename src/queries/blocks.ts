import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { useClient } from '@vocdoni/react-providers'
import { ExtendedSDKClient } from '@vocdoni/extended-sdk'
import { IChainBlockInfoResponse } from '@vocdoni/sdk'
import { useChainInfo, useChainInfoOptions } from '~queries/stats'

export const useBlockList = ({
  from,
  listSize,
  ...options
}: {
  from: number
  listSize?: number
} & Omit<UseQueryOptions<IChainBlockInfoResponse[]>, 'queryKey'>) => {
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
