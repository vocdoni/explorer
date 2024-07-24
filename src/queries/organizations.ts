import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { ExtendedSDKClient } from '@vocdoni/extended-sdk'
import { useClient } from '@vocdoni/react-providers'
import {
  ElectionListWithPagination,
  IAccountTransfersCountResponse,
  IAccountTransfersResponse,
  IChainFeesListResponse,
  IChainOrganizationCountResponse,
  IChainOrganizationListResponse,
} from '@vocdoni/sdk'
import { useProcessList } from '~queries/processes'

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
  options?: Omit<UseQueryOptions<ElectionListWithPagination>, 'queryKey'>
}) => {
  return useProcessList({
    filters: { organizationId: address, page: page },
    ...options,
  })
}

export const useAccountTransfers = ({
  address,
  page = 0,
  options,
}: {
  address: string
  page?: number
  options?: Omit<UseQueryOptions<IAccountTransfersResponse>, 'queryKey'>
}) => {
  const { client } = useClient<ExtendedSDKClient>()
  return useQuery({
    enabled: !!address,
    queryKey: ['organization', 'transfers', address, page],
    queryFn: async () => client.accountTransfers(address, page),
    ...options,
  })
}

export const useAccountTransfersCount = ({
  address,
  options,
}: {
  address: string
  options?: Omit<UseQueryOptions<IAccountTransfersCountResponse>, 'queryKey'>
}) => {
  const { client } = useClient<ExtendedSDKClient>()
  return useQuery({
    enabled: !!address,
    queryKey: ['organization', 'transfers', 'count', address],
    queryFn: async () => client.accountTransfersCount(address),
    ...options,
  })
}

export const useAccountFees = ({
  address,
  page = 0,
  options,
}: {
  address: string
  page?: number
  options?: Omit<UseQueryOptions<IChainFeesListResponse>, 'queryKey'>
}) => {
  const { client } = useClient<ExtendedSDKClient>()
  return useQuery({
    enabled: !!address,
    queryKey: ['organization', 'fees', address, page],
    queryFn: async () => client.accountFees(address, page),
    ...options,
  })
}
