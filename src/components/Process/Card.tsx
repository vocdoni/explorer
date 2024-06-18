import { Card, CardBody, Flex, HStack } from '@chakra-ui/react'
import { ElectionSchedule, ElectionTitle } from '@vocdoni/chakra-components'
import { ElectionProvider, OrganizationProvider, useElection } from '@vocdoni/react-providers'
import { InvalidElection, PublishedElection } from '@vocdoni/sdk'
import { SmallOrganizationCard } from '~components/Organizations/Card'
import { ElectionStatusBadge } from '~components/Organizations/StatusBadge'

/**
 * Show election card information
 * @param id If id provided it will fetch the election from the API
 * @param election already loaded election info to show
 * @constructor
 */
const ElectionCard = ({ id, election }: { id?: string; election?: PublishedElection }) => {
  return (
    <ElectionProvider id={id} election={election}>
      <ElectionCardContent />
    </ElectionProvider>
  )
}

const ElectionCardContent = () => {
  const { election } = useElection()

  if (election instanceof InvalidElection || !election) return null

  return (
    <Card direction={'row'} alignItems='center' pl={4}>
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
    </Card>
  )
}

export default ElectionCard
