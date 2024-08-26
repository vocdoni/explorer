import { useElection } from '@vocdoni/react-providers'
import { PublishedElection, VoteSummary } from '@vocdoni/sdk'
import { Trans, useTranslation } from 'react-i18next'
import { NoResultsError } from '~components/Layout/ContentError'
import { PaginationProvider, usePagination } from '~components/Pagination/PaginationProvider'
import { useElectionVotesList } from '~queries/processes'
import { LoadingCards } from '~components/Layout/Loading'
import { Box, Card, CardBody, CardHeader, Flex, Grid, Icon, Link, Text } from '@chakra-ui/react'
import { Pagination } from '~components/Pagination/Pagination'
import { BiEnvelope } from 'react-icons/bi'
import { generatePath, Link as RouterLink } from 'react-router-dom'
import { RoutePath } from '~constants'
import LinkCard from '~components/Layout/LinkCard'
import { BlockIconLink, TxIconLink } from '~components/Layout/IconLink'

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

  const { data: envelopes, isLoading } = useElectionVotesList({
    params: {
      electionId: election?.id,
      page: page,
    },
    enabled: !!election?.id,
  })

  if (isLoading) {
    return <LoadingCards />
  }

  if (!envelopes) {
    // todo(kon): add error handling
    return null
  }

  return (
    <Flex direction={'column'} gap={4}>
      <Grid
        templateColumns={{ base: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(5, 1fr)' }}
        gap={4}
      >
        {envelopes?.votes.map((envelope, i) => {
          return <EnvelopeCard key={i} envelope={envelope} count={page * 10 + i + 1} />
        })}
      </Grid>
      <Pagination pagination={envelopes.pagination} />
    </Flex>
  )
}

const EnvelopeCard = ({ envelope, count }: { envelope: VoteSummary; count: number }) => {
  return (
    <LinkCard to={generatePath(RoutePath.Envelope, { verifier: envelope.voteID, tab: null })} maxW='xs'>
      <CardHeader>
        <Flex justify={'space-between'}>
          <Text fontWeight={'bold'}>
            <Trans i18nKey={'envelopes.envelope_number'} num={count}>
              Envelope nº {{ num: count }}
            </Trans>
          </Text>
          <Box>
            <Icon color={'lightText'} as={BiEnvelope} />
          </Box>
        </Flex>
      </CardHeader>
      <CardBody>
        <Flex direction={'column'}>
          {/*<Link*/}
          {/*  as={RouterLink}*/}
          {/*  to={generatePath(RoutePath.Block, { height: envelope.blockHeight.toString(), tab: null, page: null })}*/}
          {/*>*/}
          {/*  <Trans i18nKey={'envelopes.block'} height={envelope.blockHeight}>*/}
          {/*    Block {{ height: envelope.blockHeight }}*/}
          {/*  </Trans>*/}
          {/*</Link>*/}
          <BlockIconLink height={envelope.blockHeight} />
          <TxIconLink block={envelope.blockHeight} index={envelope.transactionIndex} />
        </Flex>
      </CardBody>
    </LinkCard>
  )
}
