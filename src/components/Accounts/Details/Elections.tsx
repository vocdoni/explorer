import { Flex } from '@chakra-ui/react'
import { RoutedPaginationProvider, useOrganization, useRoutedPagination } from '@vocdoni/react-providers'
import { useTranslation } from 'react-i18next'
import { PaginatedAsyncList } from '~components/Layout/AsyncList'
import { NoResultsError } from '~components/Layout/ContentError'
import { ElectionCard } from '~components/Process/Card'
import { RoutePath } from '~constants'
import { useOrganizationElections } from '~queries/accounts'

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

  const { data, isLoading, isError, error } = useOrganizationElections({
    address: organization?.address as string,
    page: page,
    options: {
      enabled: !!organization?.address,
    },
  })
  if (!organization) return null

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
