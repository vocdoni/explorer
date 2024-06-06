import { lazy } from 'react'
import { useClient } from '@vocdoni/react-providers'
import { SuspenseLoader } from '~src/router/SuspenseLoader'
import Error404 from '~pages/Error404'
import { createBrowserRouter, RouteObject, RouterProvider } from 'react-router-dom'
import RouteError from '~pages/RouteError'
import Layout from '~src/layout/Default'

export const basePath = '/'
export const organizationsListPath = '/organizations/:page?/:query?'
export const processListPath = '/processs/:page?'
export const processPath = '/process/:pid'
export const organizationPath = '/organization/:pid'

const Home = lazy(() => import('~pages/Home'))
const Organization = lazy(() => import('~pages/Organization/Organization'))
const OrganizationList = lazy(() => import('~pages/Organization/List'))
const ProcessList = lazy(() => import('~pages/Process/List'))
const Vote = lazy(() => import('~pages/Vote'))

export const RoutesProvider = () => {
  const { client } = useClient()
  const routes: RouteObject[] = [
    {
      path: basePath,
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
          path: organizationsListPath,
          element: (
            <SuspenseLoader>
              <OrganizationList />
            </SuspenseLoader>
          ),
        },
        {
          path: processListPath,
          element: (
            <SuspenseLoader>
              <ProcessList />
            </SuspenseLoader>
          ),
        },
        {
          path: processPath,
          element: (
            <SuspenseLoader>
              <Vote />
            </SuspenseLoader>
          ),
          loader: async ({ params }) => await client.fetchElection(params.pid),
        },
        {
          path: organizationPath,
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
