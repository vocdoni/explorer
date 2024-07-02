import { Box, Card, CardBody, CardProps, Flex, HStack, Link } from '@chakra-ui/react'
import { OrganizationImage as Avatar, ElectionSchedule, ElectionTitle } from '@vocdoni/chakra-components'
import { ElectionProvider, OrganizationProvider, useElection, useOrganization } from '@vocdoni/react-providers'
import { InvalidElection as InvalidElectionType, PublishedElection } from '@vocdoni/sdk'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink, generatePath } from 'react-router-dom'
import { ReducedTextAndCopy } from '~components/Layout/CopyButton'
import { ElectionStatusBadge } from '~components/Organizations/StatusBadge'
import InvalidElection from '~components/Process/InvalidElection'
import { RoutePath } from '~constants'

export type ElectionCardProps = { id?: string; election?: PublishedElection } & CardProps

/**
 * Show election card information. If not id or election provided will asume it is already inside an ElectionProvider
 * @param id If id provided it will fetch the election from the API
 * @param election already loaded election info to show
 * @param rest chakra CardProps
 * @constructor
 */
export const ElectionCard = ({ id, election, ...rest }: ElectionCardProps) => {
  if (!id && !election) return <ElectionCardSkeleton {...rest} />

  return (
    <ElectionProvider id={id} election={election}>
      <ElectionCardSkeleton {...rest} />
    </ElectionProvider>
  )
}

const ElectionCardSkeleton = (rest: CardProps) => {
  const { election } = useElection()

  if (!election) return null
  if (election instanceof InvalidElectionType) {
    return <InvalidElection />
  }

  return (
    <Card direction={'row'} alignItems='center' pl={4} {...rest}>
      <Link as={RouterLink} to={generatePath(RoutePath.Process, { pid: election.id })}>
        <CardBody>
          <Flex direction={'column'} align={'start'} gap={4}>
            <HStack>
              <ElectionStatusBadge status={election.status} />
              <ElectionSchedule
                showRemaining
                fontWeight={'normal'}
                fontSize={'sm'}
                textAlign={'start'}
                fontStyle={'normal'}
              />
            </HStack>
            <ElectionTitle textAlign={'start'} fontWeight={'bold'} wordBreak='break-all' fontSize='lg' />
          </Flex>
          <OrganizationProvider id={election.organizationId}>
            <SmallOrganizationCard id={election.organizationId} />
          </OrganizationProvider>
        </CardBody>
      </Link>
    </Card>
  )
}

const SmallOrganizationCard = ({ id }: { id: string }) => {
  const { organization } = useOrganization()
  const { t } = useTranslation()

  const name = organization?.account.name.default || organization?.address

  return (
    <Flex direction={'row'} alignItems='center' gap={2}>
      <Box w={'25px'}>
        <Avatar
          mx='auto'
          fallbackSrc={'/images/fallback-account-dark.png'}
          alt={t('organization.avatar_alt', {
            name: organization?.account.name.default || organization?.address,
          }).toString()}
        />
      </Box>
      <ReducedTextAndCopy color={'textAccent1'} size='sm' toCopy={id}>
        {name}
      </ReducedTextAndCopy>
    </Flex>
  )
}
