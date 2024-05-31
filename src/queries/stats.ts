import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { useClient } from '@vocdoni/react-providers'
import { IChainGetInfoResponse } from '@vocdoni/sdk'
import { ExtendedSDKClient } from '@vocdoni/extended-sdk'

export const useChainInfo = (options?: Omit<UseQueryOptions<IChainGetInfoResponse>, 'queryKey'>) => {
  const { client } = useClient<ExtendedSDKClient>()

  return useQuery({
    queryKey: ['chainStats'],
    queryFn: client.chainInfo,
    ...options,
  })
}
