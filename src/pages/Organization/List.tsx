import { Flex } from '@chakra-ui/react'
import { OrganizationsList, OrganizationsListHeader } from '~components/Organizations/OrganizationsList'

const OrganizationList = () => {
  return (
    <Flex direction={'column'} mt={'40px'} gap={6}>
      <OrganizationsListHeader />
      <OrganizationsList />
    </Flex>
  )
}

export default OrganizationList
