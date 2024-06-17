import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { useClient } from '@vocdoni/react-providers'
import { IChainGetInfoResponse } from '@vocdoni/sdk'
import { ExtendedSDKClient } from '@vocdoni/extended-sdk'

export type useChainInfoOptions = Omit<UseQueryOptions<IChainGetInfoResponse>, 'queryKey'>

export const useChainInfo = (options?: useChainInfoOptions) => {
  const { client } = useClient<ExtendedSDKClient>()

  return useQuery({
    queryKey: ['chainStats'],
    queryFn: client.chainInfo,
    ...options,
  })
}
