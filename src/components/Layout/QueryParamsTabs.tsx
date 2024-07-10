import { TabsProps } from '@chakra-ui/tabs/dist/tabs'
import useQueryParams from '~src/router/use-query-params'
import { useEffect, useState } from 'react'
import { Tabs } from '@chakra-ui/react'

/**
 * Reimplementation ob Tabs component to store the selected tab in the query params
 * @param tabsProps
 * @constructor
 */
export const QueryParamsTabs = (tabsProps: TabsProps) => {
  const { queryParams, setQueryParams } = useQueryParams<{ tab: string }>()
  const [tab, setTab] = useState(queryParams.tab ? parseInt(queryParams.tab) : 0)
  // Ensure the correct tab is selected when browsing back/forward from the history
  useEffect(() => {
    const tabIndex = queryParams.tab ? parseInt(queryParams.tab) : 0
    setTab(tabIndex)
  }, [queryParams.tab])

  return <Tabs index={tab} onChange={(i) => setQueryParams({ tab: i.toString() })} {...tabsProps} />
}
