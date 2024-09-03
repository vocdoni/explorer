import { Flex, Grid } from '@chakra-ui/react'
import { useElection } from '@vocdoni/react-providers'
import { PublishedElection } from '@vocdoni/sdk'
import { useTranslation } from 'react-i18next'
import { ContentError, NoResultsError } from '~components/Layout/ContentError'
import { LoadingCards } from '~components/Layout/Loading'
import { Pagination } from '~components/Pagination/Pagination'
import { PaginationProvider, usePagination } from '~components/Pagination/PaginationProvider'
import { useElectionVotesList } from '~queries/processes'
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

  const { data, isLoading, isError, error } = useElectionVotesList({
    params: {
      electionId: election?.id,
      page: page,
    },
    enabled: !!election?.id,
  })

  if (isLoading) {
    return <LoadingCards />
  }

  if (data && data.votes?.length <= 0) {
    return <NoResultsError />
  }

  if (isError || !data) {
    return <ContentError error={error} />
  }
  return (
    <Flex direction={'column'} gap={4}>
      <Grid
        templateColumns={{ base: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(5, 1fr)' }}
        gap={4}
      >
        {data?.votes.map((envelope, i) => <EnvelopeCard key={i} envelope={envelope} count={page * 10 + i + 1} />)}
      </Grid>
      <Pagination pagination={data.pagination} />
    </Flex>
  )
}
