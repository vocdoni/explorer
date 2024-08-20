import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { ExtendedSDKClient } from '@vocdoni/extended-sdk'
import { useClient } from '@vocdoni/react-providers'
import { ChainAPI, IChainGetCostsResponse, IChainGetInfoResponse, IChainTxCosts } from '@vocdoni/sdk'

export type useChainInfoOptions = Omit<UseQueryOptions<IChainGetInfoResponse>, 'queryKey'>

export const useChainInfo = (options?: useChainInfoOptions) => {
  const { client } = useClient<ExtendedSDKClient>()

  return useQuery({
    queryKey: ['chainStats', 'stats'],
    queryFn: client.chainInfo,
    ...options,
  })
}

export const useBlockToDate = ({
  height,
  ...options
}: {
  height: number
} & Omit<UseQueryOptions<Awaited<ReturnType<typeof ChainAPI.blockToDate>>>, 'queryKey'>) => {
  const { client } = useClient<ExtendedSDKClient>()
  return useQuery({
    queryKey: ['blocks', 'blockToDate', height],
    queryFn: () => client.blockToDate(height),
    ...options,
  })
}

export const useChainCosts = ({ ...options }: Omit<UseQueryOptions<IChainGetCostsResponse>, 'queryKey'>) => {
  const { client } = useClient<ExtendedSDKClient>()
  return useQuery({
    queryKey: ['chainStats', 'costs'],
    queryFn: () => client.fetchChainCosts(),
    ...options,
  })
}

export const useTxsCosts = ({ ...options }: Omit<UseQueryOptions<IChainTxCosts>, 'queryKey'>) => {
  const { client } = useClient<ExtendedSDKClient>()
  return useQuery({
    queryKey: ['chainStats', 'txCost'],
    queryFn: () => client.txCosts(),
    ...options,
  })
}
