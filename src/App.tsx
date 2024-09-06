import { ColorModeScript } from '@chakra-ui/react'
import { ClientProvider } from '@vocdoni/chakra-components'
import { EnvOptions } from '@vocdoni/sdk'
import { RoutesProvider } from './router'
import { VocdoniEnvironment } from '~constants'
import { ExtendedSDKClient } from '@vocdoni/extended-sdk'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

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
