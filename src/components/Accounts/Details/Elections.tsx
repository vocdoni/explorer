import { Flex, Text } from '@chakra-ui/react'
import { AccountData } from '@vocdoni/sdk'
import { Trans, useTranslation } from 'react-i18next'
import { LoadingCards } from '~components/Layout/Loading'
import { RoutedPagination } from '~components/Pagination/Pagination'
import { RoutedPaginationProvider, useRoutedPagination } from '~components/Pagination/PaginationProvider'
import { ElectionCard } from '~components/Process/Card'
import { RoutePath } from '~constants'
import { useOrganizationElections } from '~queries/accounts'
import { ContentError, NoResultsError } from '~components/Layout/ContentError'
import { useOrganization } from '@vocdoni/react-providers'

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

  if (isLoading) {
    return <LoadingCards />
  }

  if (data?.pagination.totalItems === 0) {
    return <NoResultsError />
  }

  if (isError || !data) {
    return <ContentError error={error} />
  }

  return (
    <Flex direction={'column'} gap={4}>
      {data.elections?.map((election) => {
        return <ElectionCard key={election.id} election={election} />
      })}
      <RoutedPagination pagination={data.pagination} />
    </Flex>
  )
}

export default AccountElections
