import { Box, Flex, Heading, Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import OrganizationCard from '~components/Organizations/Card'
import { useOrganizationCount, useOrganizationList } from '~src/queries/organizations'
import { Loading } from '~src/router/SuspenseLoader'
import { RoutedPaginationProvider } from '~components/Pagination/PaginationProvider'
import { RoutedPagination } from '~components/Pagination/Pagination'
import { useParams } from 'react-router-dom'

const OrganizationList = () => {
  const { t } = useTranslation()

  const { page }: { page?: number } = useParams()

  const { data: orgsCount, isLoading: isLoadingCount, error: countError } = useOrganizationCount()
  const { data: orgs, isLoading: isLoadingOrgs } = useOrganizationList({ page: Number(page || 0) })

  const count = orgsCount?.count || 0

  const title = t('organizations.organizations_list')
  const subtitle = t('organizations.organizations_count', { count: count })

  if (isLoadingCount) return <Loading />

  return (
    <Flex direction={'column'} mt={'40px'} gap={6}>
      <Flex direction={{ base: 'column', md: 'row' }} justify={'space-between'}>
        <Flex direction={'column'}>
          <Heading isTruncated wordBreak='break-word'>
            {title}
          </Heading>
          <Text color={'lighterText'}>{subtitle}</Text>
        </Flex>
        <Box>input</Box>
      </Flex>
      <RoutedPaginationProvider totalPages={Math.ceil(count / 10)} path='/organizations/:page?'>
        {isLoadingOrgs ? (
          <Loading />
        ) : (
          orgs?.organizations.map((org) => (
            <OrganizationCard key={org.organizationID} id={org.organizationID} electionCount={org.electionCount} />
          ))
        )}
        <RoutedPagination />
      </RoutedPaginationProvider>
    </Flex>
  )
}

export default OrganizationList
