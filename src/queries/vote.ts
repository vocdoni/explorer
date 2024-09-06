import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { ExtendedSDKClient } from '@vocdoni/extended-sdk'
import { useClient } from '@vocdoni/react-providers'
import { VoteInfoResponse } from '@vocdoni/sdk'

export const useVoteInfo = ({
  verifier,
  ...options
}: {
  verifier: string
} & Omit<UseQueryOptions<VoteInfoResponse>, 'queryKey'>) => {
  const { client } = useClient<ExtendedSDKClient>()

  return useQuery({
    queryKey: ['voteInfo', verifier],
    queryFn: () => client.voteInfo(verifier),
    ...options,
  })
}
