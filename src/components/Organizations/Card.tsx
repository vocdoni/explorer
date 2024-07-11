import { Box, BoxProps, Card, CardBody, CardProps, Flex, FlexProps, Link, Text, Wrap } from '@chakra-ui/react'
import { OrganizationImage as Avatar, OrganizationName } from '@vocdoni/chakra-components'
import { OrganizationProvider, useOrganization } from '@vocdoni/react-providers'
import { Trans, useTranslation } from 'react-i18next'
import { generatePath, Link as RouterLink } from 'react-router-dom'
import { ReducedTextAndCopy } from '~components/Layout/CopyButton'
import { FallbackAccountImg, RoutePath } from '~constants'

type IOrganizationCardProps = {
  id?: string
  electionCount?: number
} & CardProps

/**
 * Show organization card information. If not id provided will asume it is already inside an OrganizationProvider
 * @param id If id provided it will fetch the organization from the API
 * @param electionCount number of elections the organization has
 * @param rest chakra CardProps
 * @constructor
 */
export const OrganizationCard = ({ id, ...rest }: IOrganizationCardProps) => {
  if (!id) return <OrganizationCardSkeleton {...rest} />

  return (
    <OrganizationProvider id={id}>
      <OrganizationCardSkeleton id={id} {...rest} />
    </OrganizationProvider>
  )
}

const OrganizationCardSkeleton = ({ electionCount: ec, ...rest }: IOrganizationCardProps) => {
  const { organization, loading } = useOrganization()
  const { t } = useTranslation()

  const electionCount = ec ?? organization?.electionIndex
  const pid = organization?.address

  if (!pid) return null

  return (
    <Card
      as={RouterLink}
      to={generatePath(RoutePath.Organization, { pid, page: null })}
      direction={'row'}
      alignItems='center'
      pl={4}
      {...rest}
    >
      <Box w={'50px'}>
        <Avatar
          mx='auto'
          fallbackSrc={FallbackAccountImg}
          alt={t('organization.avatar_alt', {
            name: organization?.account.name.default || organization?.address,
          }).toString()}
        />
      </Box>
      <Link as={RouterLink} to={generatePath(RoutePath.Organization, { pid, page: null })}>
        <CardBody>
          {loading ? (
            <Text fontWeight={'bold'} wordBreak='break-all' size='sm'>
              {pid}
            </Text>
          ) : (
            <OrganizationName fontWeight={'bold'} wordBreak='break-all' size='sm' />
          )}
          <ReducedTextAndCopy color={'textAccent1'} toCopy={pid}>
            {pid}
          </ReducedTextAndCopy>
          {electionCount && (
            <Text fontSize={'sm'}>
              <Trans i18nKey={'organization.process_count'} count={electionCount}>
                <strong>Process:</strong> {{ count: electionCount }}
              </Trans>
            </Text>
          )}
        </CardBody>
      </Link>
    </Card>
  )
}

export const SmallOrganizationCard = ({ id, flex, avatar }: { id: string; flex?: FlexProps; avatar?: BoxProps }) => {
  const { organization } = useOrganization()
  const { t } = useTranslation()

  const orgName = organization?.account.name.default

  return (
    <Flex direction={'row'} alignItems={'center'} gap={2} {...flex}>
      <Box w={'30px'} minW={'30px'} {...avatar}>
        <Avatar
          mx='auto'
          fallbackSrc={'/images/fallback-account-dark.png'}
          alt={t('organization.avatar_alt', {
            name: orgName || organization?.address,
          }).toString()}
        />
      </Box>
      <Wrap spacingX={2} spacingY={0} align={'baseline'}>
        {orgName && (
          <Text
            as={RouterLink}
            to={generatePath(RoutePath.Organization, { pid: id, page: null })}
            color={'textAccent1'}
            size='xs'
            fontWeight={'normal'}
            variant={'text'}
            pl={0}
            wordBreak='break-all'
          >
            {orgName}
          </Text>
        )}
        <ReducedTextAndCopy
          breakPoint={{ base: true }}
          color={'textAccent1'}
          size='sm'
          toCopy={id}
          to={generatePath(RoutePath.Organization, { pid: id, page: null })}
          pl={0}
          fontWeight={'normal'}
        >
          {id}
        </ReducedTextAndCopy>
      </Wrap>
    </Flex>
  )
}
