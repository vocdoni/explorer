import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { ExtendedSDKClient } from '@vocdoni/extended-sdk'
import { useClient } from '@vocdoni/react-providers'
import {
  ElectionListWithPagination,
  FetchFeesParametersWithPagination,
  FetchOrganizationParametersWithPagination,
  IChainFeesListResponse,
  IChainOrganizationListResponse,
  IChainTransfersListResponse,
} from '@vocdoni/sdk'
import { useProcessList } from '~queries/processes'
import { useChainInfo, useChainInfoOptions } from '~queries/stats'

export const useOrganizationList = ({
  params,
  ...options
}: {
  params: Partial<FetchOrganizationParametersWithPagination>
} & Omit<UseQueryOptions<IChainOrganizationListResponse>, 'queryKey'>) => {
  const { client } = useClient<ExtendedSDKClient>()
  return useQuery({
    queryKey: ['organizations', 'list', params],
    queryFn: () => client.organizationList(params),
    ...options,
  })
}

export const useOrganizationCount = (options?: useChainInfoOptions) => {
  const { data, ...rest } = useChainInfo({ ...options })
  const count = data?.organizationCount
  return { data: count, ...rest }
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
  options?: Omit<UseQueryOptions<IChainTransfersListResponse>, 'queryKey'>
}) => {
  const { client } = useClient<ExtendedSDKClient>()
  return useQuery({
    enabled: !!address,
    queryKey: ['organization', 'transfers', address, page],
    queryFn: async () => client.transfers({ accountId: address, page }),
    ...options,
  })
}

export const useAccountFees = ({
  params,
  options,
}: {
  params: Omit<FetchFeesParametersWithPagination, 'limit' | 'type' | 'reference'>
  options?: Omit<UseQueryOptions<IChainFeesListResponse>, 'queryKey'>
}) => {
  const { client } = useClient<ExtendedSDKClient>()
  return useQuery({
    enabled: !!params.accountId,
    queryKey: ['organization', 'fees', params],
    queryFn: async () => client.feesList(params),
    ...options,
  })
}
