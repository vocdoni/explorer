import { OrganizationProvider } from '@vocdoni/react-providers'
import { AccountData } from '@vocdoni/sdk'
import { useLoaderData } from 'react-router-dom'
import OrganizationDetail from '~components/Organizations/Detail'

const Organization = () => {
  const org = useLoaderData() as AccountData

  return (
    <OrganizationProvider organization={org}>
      <OrganizationDetail />
    </OrganizationProvider>
  )
}

export default Organization
