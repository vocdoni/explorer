import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { ExtendedSDKClient } from '@vocdoni/extended-sdk'
import { useClient } from '@vocdoni/react-providers'
import {
  ElectionListWithPagination,
  FetchElectionsParametersWithPagination,
  FetchVotesParametersWithPagination,
  IElectionKeysResponse,
  IVoteListResponse,
} from '@vocdoni/sdk'
import { useChainInfo, useChainInfoOptions } from '~queries/stats'
import { isValidPartialProcessId } from '~utils/strings'
import { PaginationItemsPerPage } from '~constants'

export const useProcessList = ({
  filters,
  ...options
}: {
  filters?: Partial<Omit<FetchElectionsParametersWithPagination, 'limit'>>
} & Omit<UseQueryOptions<ElectionListWithPagination>, 'queryKey'>) => {
  const { client } = useClient()

  return useQuery({
    queryKey: ['process', 'list', filters],
    queryFn: () => client.fetchElections({ limit: PaginationItemsPerPage, ...filters }),
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
  params,
  ...options
}: {
  params: Omit<FetchVotesParametersWithPagination, 'limit'>
} & Omit<UseQueryOptions<IVoteListResponse>, 'queryKey'>) => {
  const { client } = useClient<ExtendedSDKClient>()
  return useQuery({
    queryKey: ['process', 'envelopes', params],
    queryFn: () => client.electionVotesList(params),
    ...options,
  })
}
