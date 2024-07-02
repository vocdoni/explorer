import { ReactNode, Suspense } from 'react'
import { Loading } from '~components/Layout/Loading'

export const SuspenseLoader = ({ children }: { children: ReactNode }) => (
  <Suspense fallback={<Loading />}>{children}</Suspense>
)
