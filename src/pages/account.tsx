import { OrganizationProvider } from '@vocdoni/react-providers'
import { AccountData } from '@vocdoni/sdk'
import { useLoaderData } from 'react-router-dom'
import AccountDetail from '~components/Accounts/Detail'

const Account = () => {
  const org = useLoaderData() as AccountData

  return (
    <OrganizationProvider organization={org}>
      <AccountDetail />
    </OrganizationProvider>
  )
}

export default Account
