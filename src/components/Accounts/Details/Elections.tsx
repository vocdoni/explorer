import { Flex } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { RoutedPaginationProvider, useRoutedPagination } from '~components/Pagination/PaginationProvider'
import { ElectionCard } from '~components/Process/Card'
import { RoutePath } from '~constants'
import { useOrganizationElections } from '~queries/accounts'
import { NoResultsError } from '~components/Layout/ContentError'
import { useOrganization } from '@vocdoni/react-providers'
import { PaginatedAsyncList } from '~components/Layout/AsyncList'

const AccountElections = () => {
  const { t } = useTranslation()
  const { organization } = useOrganization()

  if (!organization) return null

  if (organization.electionIndex === 0) {
    return <NoResultsError msg={t('account.no_elections', { defaultValue: 'No elections yet!' })} />
  }

  return (
    <RoutedPaginationProvider path={RoutePath.Account}>
      <AccountElectionsList />
    </RoutedPaginationProvider>
  )
}

const AccountElectionsList = () => {
  const { page }: { page?: number } = useRoutedPagination()
  const { organization } = useOrganization()

  if (!organization) return null

  const { data, isLoading, isError, error } = useOrganizationElections({
    address: organization.address,
    page: page,
    options: {
      enabled: !!organization.address,
    },
  })

  return (
    <Flex direction={'column'} gap={4}>
      <PaginatedAsyncList
        isLoading={isLoading}
        elements={data?.elections}
        isError={isError}
        error={error}
        pagination={data?.pagination}
        component={({ element }) => <ElectionCard key={element.id} election={element} />}
      />
    </Flex>
  )
}

export default AccountElections
