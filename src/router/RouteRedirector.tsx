import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { OldRoutePath, RoutePath } from '~constants'

const mapOldRouteToNewRoute = (route: string): string => {
  const routeMappings: { [key: string]: string } = {
    [OldRoutePath.BlockDetails]: RoutePath.Block,
    [OldRoutePath.EnvelopeDetails]: RoutePath.Envelope,
    [OldRoutePath.OrganizationDetails]: RoutePath.Organization,
    [OldRoutePath.ProcessDetails]: RoutePath.Process,
    [OldRoutePath.TransactionDetails]: RoutePath.Transaction,
    [OldRoutePath.Verify]: RoutePath.Verify,
    [OldRoutePath.Stats]: RoutePath.Base,
  }

  for (const oldPath in routeMappings) {
    if (route.startsWith(oldPath)) {
      const newPath = routeMappings[oldPath]

      if (!newPath) return '' // fallback to undefined route

      const params = route.replace(oldPath, '').split('/').filter(Boolean)
      let paramIndex = params[0] === '#' ? 1 : 0

      const finalRoute = newPath.replace(/:(\w+)\??/g, (match) => {
        const value = params[paramIndex]
        paramIndex++
        return value || ''
      })

      return finalRoute
    }
  }

  return '' // fallback to undefined route
}

const RouteRedirector = () => {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const oldRoute = location.pathname + location.hash
    const newRoute = mapOldRouteToNewRoute(oldRoute)

    if (newRoute && newRoute !== oldRoute) {
      navigate(newRoute, { replace: true })
    }
  }, [location, navigate])

  return <Outlet />
}

export default RouteRedirector
