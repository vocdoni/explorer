import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useRoutedPagination } from '~components/Pagination/PaginationProvider'

export type QueryParamsType = Record<string, string>

const useQueryParams = <T extends QueryParamsType>() => {
  const { search } = useLocation()
  const navigate = useNavigate()
  const location = useLocation()

  const queryParams = useMemo(() => {
    const params = new URLSearchParams(search)
    const queryObj = {} as T
    for (const [key, value] of params.entries()) {
      // @ts-ignore
      queryObj[key as keyof T] = value
    }
    return queryObj
  }, [search])

  const getNewParams = (newParams: Partial<T>) => {
    const params = new URLSearchParams(search)
    for (const key in newParams) {
      if (newParams[key]) {
        params.set(key, newParams[key] as string)
      } else {
        params.delete(key)
      }
    }
    return params
  }

  const setQueryParams = (newParams: Partial<T>) => {
    navigate(`${location.pathname}?${getNewParams(newParams).toString()}`)
  }

  return { queryParams, setQueryParams, getNewParams }
}

/**
 * Hook to manage query params and pagination.
 * When a query param is set, the page is reset to 1.
 */
export const useRoutedPaginationQueryParams = <T extends QueryParamsType>() => {
  const { queryParams, getNewParams } = useQueryParams<T>()
  const { setPage } = useRoutedPagination()
  const setQueryParams = (filters: Partial<T>) => {
    setPage(1, `?${getNewParams(filters).toString()}`)
  }

  return { queryParams, setQueryParams }
}

export default useQueryParams
