import { Flex, Text } from '@chakra-ui/react'
import { AccountData } from '@vocdoni/sdk'
import { Trans } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { LoadingCards } from '~components/Layout/Loading'
import { RoutedPagination } from '~components/Pagination/Pagination'
import { RoutedPaginationProvider } from '~components/Pagination/PaginationProvider'
import { ElectionCard } from '~components/Process/Card'
import { PaginationItemsPerPage, RoutePath } from '~constants'
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
    <RoutedPaginationProvider
      totalPages={Math.ceil(org.electionIndex / PaginationItemsPerPage)}
      path={RoutePath.Organization}
    >
      <Flex direction={'column'} gap={4}>
        <OrganizationElectionsList org={org} />
        <RoutedPagination />
      </Flex>
    </RoutedPaginationProvider>
  )
}

const OrganizationElectionsList = ({ org }: OrgComponentProps) => {
  const { page } = useParams()

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

  const elections = data.elections

  return (
    <Flex direction={'column'} gap={4}>
      {elections?.map((election) => {
        return <ElectionCard key={election.id} election={election} />
      })}
    </Flex>
  )
}

export default OrganizationElections
