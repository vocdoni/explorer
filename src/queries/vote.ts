import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { VoteInfoResponse } from '@vocdoni/sdk'
import { useClient } from '@vocdoni/react-providers'
import { ExtendedSDKClient } from '@vocdoni/extended-sdk'

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
