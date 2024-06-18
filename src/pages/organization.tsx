import { Flex } from '@chakra-ui/react'
import { OrganizationProvider } from '@vocdoni/react-providers'
import { AccountData } from '@vocdoni/sdk'
import { useLoaderData } from 'react-router-dom'
import OrganizationDetail from '~components/Organizations/Detail'

const Organization = () => {
  const org = useLoaderData() as AccountData

  return (
    <Flex direction={'column'} mt={'40px'} gap={6}>
      <OrganizationProvider organization={org}>
        <OrganizationDetail />
      </OrganizationProvider>
    </Flex>
  )
}

export default Organization
