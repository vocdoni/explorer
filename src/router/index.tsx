import { useClient } from '@vocdoni/react-providers'
import { lazy } from 'react'
import { createBrowserRouter, RouteObject, RouterProvider } from 'react-router-dom'
import { RoutePath } from '~constants'
import Layout from '~src/layout/Default'
import Error404 from '~src/router/Error404'
import RouteError from '~src/router/RouteError'
import { SuspenseLoader } from '~src/router/SuspenseLoader'

const Home = lazy(() => import('~pages/Home'))
const Organization = lazy(() => import('~pages/organization'))
const OrganizationsList = lazy(() => import('~pages/organizations'))
const ProcessList = lazy(() => import('~pages/processes'))
const Process = lazy(() => import('~pages/process'))

export const RoutesProvider = () => {
  const { client } = useClient()
  const routes: RouteObject[] = [
    {
      path: RoutePath.Base,
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
          path: RoutePath.OrganizationsList,
          element: (
            <SuspenseLoader>
              <OrganizationsList />
            </SuspenseLoader>
          ),
        },
        {
          path: RoutePath.ProcessesList,
          element: (
            <SuspenseLoader>
              <ProcessList />
            </SuspenseLoader>
          ),
        },
        {
          path: RoutePath.Process,
          element: (
            <SuspenseLoader>
              <Process />
            </SuspenseLoader>
          ),
          loader: async ({ params }) => await client.fetchElection(params.pid),
        },
        {
          path: RoutePath.Organization,
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
