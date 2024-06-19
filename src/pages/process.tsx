import { useLoaderData } from 'react-router-dom'
import { ArchivedElection, InvalidElection as InvalidElectionType, PublishedElection } from '@vocdoni/sdk'
import { ElectionProvider, OrganizationProvider, useElection } from '@vocdoni/react-providers'
import Detail from '~components/Process/Detail'
import { Flex } from '@chakra-ui/react'
import InvalidElection from '~components/Process/InvalidElection'

const ProcessView = () => {
  const { election } = useElection()
  if (!election) return <></>
  if (election instanceof InvalidElectionType) {
    return <InvalidElection />
  }

  return (
    <OrganizationProvider id={election.organizationId}>
      <Detail />
    </OrganizationProvider>
  )
}

const Process = () => {
  const election = useLoaderData() as PublishedElection | ArchivedElection
  return (
    <Flex direction={'column'} mt={'40px'} gap={6}>
      <ElectionProvider election={election}>
        <ProcessView />
      </ElectionProvider>
    </Flex>
  )
}

export default Process
