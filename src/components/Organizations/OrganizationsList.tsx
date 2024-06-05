import { Box, Flex, Heading, Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { InputSearch } from '~src/layout/inputs'
import { useOrganizationCount, useOrganizationList } from '~queries/organizations'
import { debounce } from '~utils/debounce'
import { generatePath, useNavigate, useParams } from 'react-router-dom'
import { RoutedPaginationProvider } from '~components/Pagination/PaginationProvider'
import { Loading } from '~src/router/SuspenseLoader'
import OrganizationCard from '~components/Organizations/Card'
import { RoutedPagination } from '~components/Pagination/Pagination'

export const OrganizationsListHeader = () => {
  const { t } = useTranslation()
  const { data: orgsCount, isLoading, error: countError } = useOrganizationCount()
  const { page, orgId }: { page?: number; orgId?: string } = useParams()
  const navigate = useNavigate()

  const count = orgsCount?.count || 0

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

  return (
    <Flex direction={{ base: 'column', md: 'row' }} justify={'space-between'}>
      <Flex direction={'column'}>
        <Heading isTruncated wordBreak='break-word'>
          {t('organizations.organizations_list')}
        </Heading>
        {!isLoading && <Text color={'lighterText'}>{t('organizations.organizations_count', { count: count })}</Text>}
      </Flex>
      <Box>
        <InputSearch maxW={'300px'} placeholder={t('organizations.search_by_org_id')} onChange={searchOnChange} />
      </Box>
    </Flex>
  )
}

export const OrganizationsList = () => {
  const { page, orgId }: { page?: number; orgId?: string } = useParams()
  const { data: orgsCount, isLoading: isLoadingCount, error: countError } = useOrganizationCount()
  const count = orgsCount?.count || 0

  const { data: orgs, isLoading: isLoadingOrgs } = useOrganizationList({
    page: Number(page || 0),
    organizationId: orgId,
  })

  const isLoading = isLoadingCount || isLoadingOrgs

  if (isLoading) {
    return <Loading />
  }

  return (
    <>
      <RoutedPaginationProvider totalPages={Math.ceil(count / 10)} path='/organizations/:page?/:orgId?'>
        {orgs?.organizations.map((org) => (
          <OrganizationCard key={org.organizationID} id={org.organizationID} electionCount={org.electionCount} />
        ))}
        <RoutedPagination />
      </RoutedPaginationProvider>
    </>
  )
}
