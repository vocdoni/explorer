import { ColorModeScript } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ClientProvider } from '@vocdoni/chakra-components'
import { ExtendedSDKClient } from '@vocdoni/extended-sdk'
import { ClientOptions, EnvOptions } from '@vocdoni/sdk'
import { VocdoniEnvironment } from '~constants'
import { RoutesProvider } from './router'

const queryClient = new QueryClient()

export const App = () => {
  const environment = VocdoniEnvironment as EnvOptions

  const options: ClientOptions = {
    env: environment,
  }

  if (import.meta.env.VOCHAIN_ENDPOINT) {
    options.api_url = import.meta.env.VOCHAIN_ENDPOINT
  }

  const sdkClient = new ExtendedSDKClient(options)

  return (
    <QueryClientProvider client={queryClient}>
      <ClientProvider env={environment} client={sdkClient} options={options}>
        <RoutesProvider />
        <ColorModeScript />
      </ClientProvider>
    </QueryClientProvider>
  )
}
