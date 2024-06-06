import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { useClient } from '@vocdoni/react-providers'
import { ExtendedSDKClient } from '@vocdoni/extended-sdk'
import { Census, IElectionListFilter, IElectionListResponse, PublishedElection } from '@vocdoni/sdk'
import { useChainInfo, useChainInfoOptions } from '~queries/stats'

export const useProcessList = ({
  page,
  filters,
  ...options
}: {
  page: number
  filters?: IElectionListFilter
} & Omit<UseQueryOptions<IElectionListResponse, Error, { elections: PublishedElection[] }>, 'queryKey'>) => {
  const { client } = useClient<ExtendedSDKClient>()
  return useQuery({
    queryKey: ['organizations', 'list', page],
    queryFn: () => client.electionList(page, { ...filters }),
    select: (data) => {
      const elections = data?.elections.map((election) => {
        // @ts-ignore
        return PublishedElection.build({
          ...election,
          id: election.electionId,
          title: election.electionId,
          census: {} as Census,
          startDate: new Date(election.startDate),
          endDate: new Date(election.endDate),
        })
      })
      return { elections }
    },
    ...options,
  })
}

export const useProcessesCount = (options?: useChainInfoOptions) => {
  const { data, ...rest } = useChainInfo({ ...options })
  const count = data?.electionCount || 0
  return { data: count, ...rest }
}
