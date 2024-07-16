import { ExtendedSDKClient } from '@vocdoni/extended-sdk'
import { useClient } from '@vocdoni/react-providers'
import { lazy } from 'react'
import { createBrowserRouter, RouteObject, RouterProvider } from 'react-router-dom'
import { BlockNotFound } from '~src/router/errors/BlockNotFound'
import { RoutePath } from '~constants'
import Layout from '~src/layout/Default'
import Error404 from '~src/router/errors/Error404'
import RouteError from '~src/router/errors/RouteError'
import { SuspenseLoader } from '~src/router/SuspenseLoader'
import { ElectionError } from '~src/router/ElectionError'

const Home = lazy(() => import('~pages/Home'))
const Block = lazy(() => import('~pages/block'))
const BlocksList = lazy(() => import('~pages/blocks'))
const Envelope = lazy(() => import('~pages/envelope'))
const Organization = lazy(() => import('~pages/organization'))
const OrganizationsList = lazy(() => import('~pages/organizations'))
const ProcessList = lazy(() => import('~pages/processes'))
const Process = lazy(() => import('~pages/process'))
const Transaction = lazy(() => import('~pages/transaction'))
const TransactionsList = lazy(() => import('~pages/transactions'))
const Validators = lazy(() => import('~pages/validators'))
const Verify = lazy(() => import('~pages/verify'))

export const RoutesProvider = () => {
  const { client } = useClient<ExtendedSDKClient>()
  const routes: RouteObject[] = [
    {
      path: RoutePath.Base,
      element: <Layout />,
      children: [
        {
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
              path: RoutePath.Block,
              element: (
                <SuspenseLoader>
                  <Block />
                </SuspenseLoader>
              ),
              loader: async ({ params }) => await client.blockByHeight(Number(params.height)),
              errorElement: <BlockNotFound />,
            },
            {
              path: RoutePath.BlocksList,
              element: (
                <SuspenseLoader>
                  <BlocksList />
                </SuspenseLoader>
              ),
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
              path: RoutePath.Envelope,
              element: (
                <SuspenseLoader>
                  <Envelope />
                </SuspenseLoader>
              ),
              loader: async ({ params }) => await client.voteInfo(params.verifier as string),
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
              errorElement: <ElectionError />,
            },
            {
              path: RoutePath.Transaction,
              element: (
                <SuspenseLoader>
                  <Transaction />
                </SuspenseLoader>
              ),
              loader: async ({ params }) => await client.txInfoByBlock(Number(params.block), Number(params.index)),
            },
            {
              path: RoutePath.TransactionsList,
              element: (
                <SuspenseLoader>
                  <TransactionsList />
                </SuspenseLoader>
              ),
            },
            {
              path: RoutePath.Validators,
              element: (
                <SuspenseLoader>
                  <Validators />
                </SuspenseLoader>
              ),
              loader: async ({ params }) => await client.validatorsList(),
            },
            {
              path: RoutePath.Verify,
              element: (
                <SuspenseLoader>
                  <Verify />
                </SuspenseLoader>
              ),
            },
            {
              path: '*',
              element: <Error404 />,
            },
          ],
        },
      ],
    },
  ]
  const router = createBrowserRouter(routes)

  return <RouterProvider router={router} />
}
