import { lazy } from 'react'
import { useClient } from '@vocdoni/react-providers'
import { SuspenseLoader } from '~src/router/SuspenseLoader'
import Error404 from '~pages/Error404'
import { createBrowserRouter, RouteObject, RouterProvider } from 'react-router-dom'
import RouteError from '~pages/RouteError'
import Layout from '~src/layout/Default'

const Home = lazy(() => import('~pages/Home'))
const Organization = lazy(() => import('~pages/Organization'))
const Vote = lazy(() => import('~pages/Vote'))

export const RoutesProvider = () => {
  const { client } = useClient()
  const routes: RouteObject[] = [
    {
      path: '/',
      element: <Layout />,
      errorElement: <RouteError />,
      children: [
        {
          index: true,
          element: (
            <SuspenseLoader>
              <Home />
            </SuspenseLoader>
          ),
        },
        {
          path: '/process/:pid',
          element: (
            <SuspenseLoader>
              <Vote />
            </SuspenseLoader>
          ),
          loader: async ({ params }) => await client.fetchElection(params.pid),
        },
        {
          path: '/organization/:pid',
          element: (
            <SuspenseLoader>
              <Organization />
            </SuspenseLoader>
          ),
          loader: async ({ params }) => await client.fetchAccount(params.pid),
        },
        {
          path: '*',
          element: <Error404 />,
        },
      ],
    },
  ]
  const router = createBrowserRouter(routes)

  return <RouterProvider router={router} />
}
