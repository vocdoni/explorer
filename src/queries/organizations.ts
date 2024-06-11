import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { ExtendedSDKClient } from '@vocdoni/extended-sdk'
import { useClient } from '@vocdoni/react-providers'
import {
  ArchivedElection,
  IChainOrganizationCountResponse,
  IChainOrganizationListResponse,
  InvalidElection,
  PublishedElection,
} from '@vocdoni/sdk'

export const useOrganizationList = ({
  page,
  organizationId,
  ...options
}: {
  page: number
  organizationId?: string
} & Omit<UseQueryOptions<IChainOrganizationListResponse>, 'queryKey'>) => {
  const { client } = useClient<ExtendedSDKClient>()
  return useQuery({
    queryKey: ['organizations', 'list', page, organizationId],
    queryFn: () => client.organizationList(page - 1, organizationId),
    ...options,
  })
}

export const useOrganizationCount = (options?: Omit<UseQueryOptions<IChainOrganizationCountResponse>, 'queryKey'>) => {
  const { client } = useClient<ExtendedSDKClient>()
  return useQuery({
    queryKey: ['organizations', 'count'],
    queryFn: client.organizationCount,
    ...options,
  })
}

export const useOrganizationElections = ({
  address,
  page = 0,
  options,
}: {
  address: string
  page?: number
  options?: Omit<UseQueryOptions<Array<PublishedElection | InvalidElection | ArchivedElection>>, 'queryKey'>
}) => {
  const { client } = useClient()

  return useQuery({
    enabled: !!address,
    queryKey: ['organization', 'elections', address, page],
    queryFn: async () => client.fetchElections(address, page),
    ...options,
  })
}
