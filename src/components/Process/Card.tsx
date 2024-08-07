import { CardBody, CardProps, Flex, HStack } from '@chakra-ui/react'
import { ElectionSchedule, ElectionTitle } from '@vocdoni/chakra-components'
import { ElectionProvider, OrganizationProvider, useElection } from '@vocdoni/react-providers'
import { InvalidElection as InvalidElectionType, PublishedElection } from '@vocdoni/sdk'
import { generatePath } from 'react-router-dom'
import { ElectionStatusBadge } from '~components/Organizations/StatusBadge'
import InvalidElection from '~components/Process/InvalidElection'
import { RoutePath } from '~constants'
import { SmallOrganizationCard } from '~components/Organizations/Card'
import LinkCard from '~components/Layout/LinkCard'

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
    <LinkCard
      direction={'row'}
      alignItems='center'
      pl={4}
      to={generatePath(RoutePath.Process, { pid: election.id, tab: null })}
      {...rest}
    >
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
    </LinkCard>
  )
}
