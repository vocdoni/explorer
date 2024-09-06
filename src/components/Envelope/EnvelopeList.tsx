import { Flex, Grid } from '@chakra-ui/react'
import { Pagination } from '@vocdoni/chakra-components'
import { PaginationProvider, useElection, usePagination } from '@vocdoni/react-providers'
import { PublishedElection, VoteSummary } from '@vocdoni/sdk'
import { useTranslation } from 'react-i18next'
import { ListDataDisplay } from '~components/Layout/AsyncList'
import { NoResultsError } from '~components/Layout/ContentError'
import { useElectionVotesList } from '~queries/processes'
import { generateListStub, PaginationStub } from '~utils/stubs'
import { EnvelopeCard } from './EnvelopeCard'

export const PaginatedEnvelopeList = () => {
  const { election: e } = useElection()
  const election = e as PublishedElection
  const { t } = useTranslation()

  if (!election || election.voteCount === 0) {
    return <NoResultsError msg={t('election.no_votes_yet', { defaultValue: 'No votes yet!' })} />
  }

  return (
    <PaginationProvider>
      <EnvelopeList />
    </PaginationProvider>
  )
}

const EnvelopeList = () => {
  const { page } = usePagination()
  const { election: e } = useElection()
  const election = e as PublishedElection

  const { data, isPlaceholderData, isError, error } = useElectionVotesList({
    params: {
      electionId: election?.id,
      page: page,
    },
    enabled: !!election?.id,
    placeholderData: {
      votes: generateListStub<VoteSummary>(
        {
          txHash: 'txHash',
          voteID: 'voteID',
          voterID: 'voterID',
          electionID: 'electionID',
          blockHeight: 1,
          transactionIndex: 2,
        },
        10
      ),
      pagination: PaginationStub,
    },
  })

  return (
    <Flex direction={'column'} gap={4}>
      <ListDataDisplay elements={data?.votes} isError={isError} error={error}>
        <Grid
          templateColumns={{ base: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(5, 1fr)' }}
          gap={4}
        >
          {data?.votes.map((envelope, i) => (
            <EnvelopeCard isLoading={isPlaceholderData} key={i} envelope={envelope} count={page * 10 + i + 1} />
          ))}
        </Grid>
        {!isPlaceholderData && data?.pagination && <Pagination pagination={data?.pagination} />}
      </ListDataDisplay>
    </Flex>
  )
}
