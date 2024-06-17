import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const useQueryParams = <T extends Record<string, string>>() => {
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

  const setQueryParams = (newParams: Partial<T>) => {
    const params = new URLSearchParams(search)
    for (const key in newParams) {
      if (newParams[key]) {
        params.set(key, newParams[key] as string)
      } else {
        params.delete(key)
      }
    }
    navigate(`${location.pathname}?${params.toString()}`)
  }

  return { queryParams, setQueryParams }
}

export default useQueryParams
