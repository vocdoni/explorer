import { useClient } from '@vocdoni/react-providers'
import { lazy } from 'react'
import { createHashRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Error404 from '~src/pages/Error404'
import RouteError from '~src/pages/RouteError'
import Layout from '~src/layout/Default'
import { SuspenseLoader } from './SuspenseLoader'

const Home = lazy(() => import('~src/pages/Home'))
const Organization = lazy(() => import('~src/pages/Organization'))
const Vote = lazy(() => import('~src/pages/Vote'))

export const RoutesProvider = () => {
  const { client } = useClient()
  const router = createHashRouter(
    createRoutesFromElements(
      <Route path='/' element={<Layout />} errorElement={<RouteError />}>
        <Route
          index
          element={
            <SuspenseLoader>
              <Home />
            </SuspenseLoader>
          }
        />
        <Route
          element={
            <SuspenseLoader>
              <Vote />
            </SuspenseLoader>
          }
          path='/process/:pid'
          loader={async ({ params }) => await client.fetchElection(params.pid)}
        />
        <Route
          element={
            <SuspenseLoader>
              <Organization />
            </SuspenseLoader>
          }
          path='/organization/:pid'
          loader={async ({ params }) => await client.fetchAccount(params.pid)}
        />
        <Route path='*' element={<Error404 />} />
      </Route>
    )
  )

  return <RouterProvider router={router} />
}
