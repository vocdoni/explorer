import {TabsProps} from '@chakra-ui/tabs/dist/tabs'
import {useEffect, useState} from 'react'
import {Tabs} from '@chakra-ui/react'
import useQueryParams from '~src/router/use-query-params'
import {generatePath, useLocation, useNavigate, useParams} from 'react-router-dom'
import {RoutePath} from '~constants'

/**
 * Reimplementation ob Tabs component to store the selected tab in the query params
 * @param useRouteQueryParams if set to true it uses the query params instead use route path param
 * @param tabsProps
 * @constructor
 */
export const RouteParamsTabs = ({
  path,
  ...tabsProps
}: {
  path?: RoutePath
} & TabsProps) => {
  const { queryParams, setQueryParams } = useQueryParams<{ tab: string }>()

  const { search } = useLocation()
  const navigate = useNavigate()
  const { tab: routerTab, ...extraParams }: { tab?: string } = useParams()

  const [tab, setTab] = useState(queryParams.tab ? parseInt(queryParams.tab) : 0)

  // Ensure the correct tab is selected when browsing back/forward from the history
  useEffect(() => {
    let tabIndex = 0
    if (path && routerTab) {
      tabIndex = parseInt(routerTab)
    } else if (queryParams.tab) {
      tabIndex = parseInt(queryParams.tab)
    }
    setTab(tabIndex)
  }, [queryParams.tab, path, routerTab])

  // Chang etab param depending on if is route or query params
  const setTabParam = (tab: string) => {
    if (path) {
      // Ts warns that not all the routes contain a tab param
      // @ts-ignore
      navigate(generatePath(path, { tab, ...extraParams }) + search)
      return
    }
    setQueryParams({ tab: tab })
  }

  // return <Tabs index={tab} onChange={(i) => setQueryParams({ tab: i.toString() })} {...tabsProps} />
  return <Tabs index={tab} onChange={(i) => setTabParam(i.toString())} {...tabsProps} />
}
