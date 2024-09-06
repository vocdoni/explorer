import { ColorModeScript } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ClientProvider } from '@vocdoni/chakra-components'
import { ExtendedSDKClient } from '@vocdoni/extended-sdk'
import { EnvOptions } from '@vocdoni/sdk'
import { VocdoniEnvironment } from '~constants'
import { RoutesProvider } from './router'

const queryClient = new QueryClient()

export const App = () => {
  const environment = VocdoniEnvironment as EnvOptions

  const sdkClient = new ExtendedSDKClient({
    env: environment,
  })

  return (
    <QueryClientProvider client={queryClient}>
      <ClientProvider env={environment} client={sdkClient}>
        <RoutesProvider />
        <ColorModeScript />
      </ClientProvider>
    </QueryClientProvider>
  )
}
