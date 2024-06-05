import { lazy } from 'react'
import { useClient } from '@vocdoni/react-providers'
import { SuspenseLoader } from '~src/router/SuspenseLoader'
import Error404 from '~pages/Error404'
import { createBrowserRouter, RouteObject, RouterProvider } from 'react-router-dom'
import RouteError from '~pages/RouteError'
import Layout from '~src/layout/Default'

export const BASE_PATH = '/'
export const ORGANIZATIONS_LIST_PATH = '/organizations/:page?/:query?'
export const PROCESS_PATH = '/process/:pid'
export const ORGANIZATION_PATH = '/organization/:pid'

const Home = lazy(() => import('~pages/Home'))
const Organization = lazy(() => import('~pages/Organization/Organization'))
const OrganizationList = lazy(() => import('~pages/Organization/List'))
const Vote = lazy(() => import('~pages/Vote'))

export const RoutesProvider = () => {
  const { client } = useClient()
  const routes: RouteObject[] = [
    {
      path: BASE_PATH,
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
          path: ORGANIZATIONS_LIST_PATH,
          element: (
            <SuspenseLoader>
              <OrganizationList />
            </SuspenseLoader>
          ),
        },
        {
          path: PROCESS_PATH,
          element: (
            <SuspenseLoader>
              <Vote />
            </SuspenseLoader>
          ),
          loader: async ({ params }) => await client.fetchElection(params.pid),
        },
        {
          path: ORGANIZATION_PATH,
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
