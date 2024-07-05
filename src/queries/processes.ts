import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { ExtendedSDKClient } from '@vocdoni/extended-sdk'
import { useClient } from '@vocdoni/react-providers'
import {
  Census,
  IElectionKeysResponse,
  IElectionListFilter,
  IElectionListResponse,
  IElectionVoteListResponse,
  PublishedElection,
} from '@vocdoni/sdk'
import { useChainInfo, useChainInfoOptions } from '~queries/stats'
import { isValidPartialProcessId } from '~utils/strings'

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
    queryKey: ['process', 'list', page, filters],
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
    enabled: !filters?.electionId || (!!filters?.electionId && isValidPartialProcessId(filters?.electionId)),
    ...options,
  })
}

export const useProcessesCount = (options?: useChainInfoOptions) => {
  const { data, ...rest } = useChainInfo({ ...options })
  const count = data?.electionCount || 0
  return { data: count, ...rest }
}

export const useElectionKeys = ({
  electionId,
  ...options
}: {
  electionId: string
} & Omit<UseQueryOptions<IElectionKeysResponse>, 'queryKey'>) => {
  const { client } = useClient<ExtendedSDKClient>()
  return useQuery({
    queryKey: ['process', 'electionKeys', electionId],
    queryFn: () => client.electionKeys(electionId),
    ...options,
  })
}

export const useElectionVotesList = ({
  electionId,
  page,
  ...options
}: {
  electionId: string
  page?: number
} & Omit<UseQueryOptions<IElectionVoteListResponse>, 'queryKey'>) => {
  const { client } = useClient<ExtendedSDKClient>()
  return useQuery({
    queryKey: ['process', 'envelopes', electionId, page],
    queryFn: () => client.electionVotesList(electionId, page),
    ...options,
  })
}
