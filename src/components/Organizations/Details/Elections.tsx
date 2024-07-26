import { Flex, Text } from '@chakra-ui/react'
import { AccountData } from '@vocdoni/sdk'
import { Trans } from 'react-i18next'
import { LoadingCards } from '~components/Layout/Loading'
import { RoutedPagination } from '~components/Pagination/Pagination'
import { RoutedPaginationProvider, useRoutedPagination } from '~components/Pagination/PaginationProvider'
import { ElectionCard } from '~components/Process/Card'
import { RoutePath } from '~constants'
import { useOrganizationElections } from '~queries/organizations'
import { retryUnlessNotFound } from '~utils/queries'
import LoadingError from '~components/Layout/LoadingError'

interface OrgComponentProps {
  org: AccountData
}

const OrganizationElections = ({ org }: OrgComponentProps) => {
  if (org.electionIndex === 0) {
    return (
      <Text>
        <Trans i18nKey={'organization.no_elections'}>No elections yet!</Trans>
      </Text>
    )
  }

  return (
    <RoutedPaginationProvider path={RoutePath.Organization}>
      <OrganizationElectionsList org={org} />
    </RoutedPaginationProvider>
  )
}

const OrganizationElectionsList = ({ org }: OrgComponentProps) => {
  const { page }: { page?: number } = useRoutedPagination()

  const { data, isLoading, isError, error } = useOrganizationElections({
    address: org.address,
    page: Number(page) - 1 || 0,
    options: {
      enabled: !!org.address,
      retry: retryUnlessNotFound,
    },
  })

  if (isLoading) {
    return <LoadingCards />
  }

  if (!data || data?.elections.length === 0 || isError) {
    return <LoadingError error={error} />
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

export default OrganizationElections
