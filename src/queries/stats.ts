import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { ExtendedSDKClient } from '@vocdoni/extended-sdk'
import { useClient } from '@vocdoni/react-providers'
import { ChainAPI, IChainGetCostsResponse, IChainGetInfoResponse } from '@vocdoni/sdk'

export type useChainInfoOptions = Omit<UseQueryOptions<IChainGetInfoResponse>, 'queryKey'>

export const useChainInfo = (options?: useChainInfoOptions) => {
  const { client } = useClient<ExtendedSDKClient>()

  return useQuery({
    queryKey: ['chainStats', 'stats'],
    queryFn: client.chainInfo,
    ...options,
  })
}

export const useBlockToDate = ({
  height,
  ...options
}: {
  height: number
} & Omit<UseQueryOptions<Awaited<ReturnType<typeof ChainAPI.blockToDate>>>, 'queryKey'>) => {
  const { client } = useClient<ExtendedSDKClient>()
  return useQuery({
    queryKey: ['blocks', 'blockToDate', height],
    queryFn: () => client.blockToDate(height),
    ...options,
  })
}

export const useChainCosts = ({ ...options }: Omit<UseQueryOptions<IChainGetCostsResponse>, 'queryKey'>) => {
  const { client } = useClient<ExtendedSDKClient>()
  return useQuery({
    queryKey: ['chainStats', 'costs'],
    queryFn: () => client.fetchChainCosts(),
    ...options,
  })
}

// todo(kon): This need to be implemented on the SDK https://github.com/vocdoni/vocdoni-sdk/issues/403

type TxCostsType = {
  costs: {
    AddDelegateForAccount: number
    CollectFaucet: number
    CreateAccount: number
    DelAccountSIK: number
    DelDelegateForAccount: number
    NewProcess: number
    RegisterKey: number
    SendTokens: number
    SetAccountInfoURI: number
    SetAccountSIK: number
    SetAccountValidator: number
    SetProcessCensus: number
    SetProcessDuration: number
    SetProcessQuestionIndex: number
    SetProcessStatus: number
  }
}

export const useTxsCosts = ({ ...options }: Omit<UseQueryOptions<TxCostsType>, 'queryKey'>) => {
  const { client } = useClient<ExtendedSDKClient>()
  return useQuery({
    queryKey: ['chainStats', 'txCost'],
    queryFn: () => client.txCosts(),
    ...options,
  })
}
