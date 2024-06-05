import { Box, Flex, Heading, Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import OrganizationCard from '~components/Organizations/Card'
import { useOrganizationCount, useOrganizationList } from '~src/queries/organizations'
import { Loading } from '~src/router/SuspenseLoader'
import { RoutedPaginationProvider } from '~components/Pagination/PaginationProvider'
import { RoutedPagination } from '~components/Pagination/Pagination'
import { generatePath, useNavigate, useParams } from 'react-router-dom'
import { InputSearch } from '~src/layout/inputs'
import { debounce } from '~utils/debounce'

const OrganizationList = () => {
  const { t } = useTranslation()

  const { page, orgId }: { page?: number; orgId?: string } = useParams()
  const navigate = useNavigate()

  const { data: orgsCount, isLoading: isLoadingCount, error: countError } = useOrganizationCount()
  const { data: orgs, isLoading: isLoadingOrgs } = useOrganizationList({
    page: Number(page || 0),
    organizationId: orgId,
  })

  const count = orgsCount?.count || 0

  const title = t('organizations.organizations_list')
  const subtitle = t('organizations.organizations_count', { count: count })

  const debouncedSearch = debounce((value) => {
    const getPath = () => {
      // If previous state has not org id, ensure to look at the first page
      if (!orgId || orgId.length === 0) {
        return generatePath('/organizations/:page?/:orgId?', { page: '0', orgId: value as string })
      }
      return generatePath('/organizations/:page?/:orgId?', { page: page?.toString() || '0', orgId: value as string })
    }
    navigate(getPath())
  }, 1000)

  const searchOnChange = (event: any) => {
    debouncedSearch(event.target.value)
  }

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
        <Box>
          <InputSearch maxW={'300px'} placeholder={t('organizations.search_by_org_id')} onChange={searchOnChange} />
        </Box>
      </Flex>
      <RoutedPaginationProvider totalPages={Math.ceil(count / 10)} path='/organizations/:page?/:orgId?'>
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
