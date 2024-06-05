import { ReactNode, Suspense } from 'react'
import { Loading } from '~src/layout/Loading'

export const SuspenseLoader = ({ children }: { children: ReactNode }) => (
  <Suspense fallback={<Loading />}>{children}</Suspense>
)
