import { ExtendedSDKClient } from '@vocdoni/extended-sdk'
import { useClient } from '@vocdoni/react-providers'
import { IChainTxReference } from '@vocdoni/sdk'
import { lazy } from 'react'
import { createBrowserRouter, RouteObject, RouterProvider } from 'react-router-dom'
import { RoutePath } from '~constants'
import Layout from '~src/layout/Default'
import { BlockNotFound } from './errors/BlockNotFound'
import { ElectionError } from './errors/ElectionError'
import Error404 from './errors/Error404'
import RouteError from './errors/RouteError'
import RouteRedirector from './RouteRedirector'
import { SuspenseLoader } from './SuspenseLoader'

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
const Validator = lazy(() => import('~pages/validator'))
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
          element: <RouteRedirector />,
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
              path: RoutePath.TransactionByHashOrHeight,
              element: (
                <SuspenseLoader>
                  <Transaction />
                </SuspenseLoader>
              ),
              loader: async ({ params }) => {
                let tx: IChainTxReference
                if (params.hashOrHeight && isNaN(Number(params.hashOrHeight))) {
                  tx = await client.txInfo(params.hashOrHeight)
                } else {
                  tx = await client.txByIndex(Number(params.hashOrHeight))
                }

                return await client.txInfoByBlock(Number(tx.blockHeight), Number(tx.transactionIndex))
              },
            },
            {
              path: RoutePath.Validator,
              element: (
                <SuspenseLoader>
                  <Validator />
                </SuspenseLoader>
              ),
              loader: async ({ params }) => await client.validatorsList(),
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
