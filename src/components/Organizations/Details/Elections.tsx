import { Flex, Text } from '@chakra-ui/react'
import { AccountData } from '@vocdoni/sdk'
import { Trans } from 'react-i18next'
import { LoadingCards } from '~components/Layout/Loading'
import { RoutedPagination } from '~components/Pagination/Pagination'
import { RoutedPaginationProvider, useRoutedPagination } from '~components/Pagination/PaginationProvider'
import { ElectionCard } from '~components/Process/Card'
import { RoutePath } from '~constants'
import { useOrganizationElections } from '~queries/organizations'
import { ContentError, NoResultsError } from '~components/Layout/ContentError'

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
    page: page,
    options: {
      enabled: !!org.address,
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

export default OrganizationElections
