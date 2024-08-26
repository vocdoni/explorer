import { Box, CardBody, CardHeader, Flex, Icon, Text } from '@chakra-ui/react'
import { VoteSummary } from '@vocdoni/sdk'
import { Trans } from 'react-i18next'
import { BiEnvelope } from 'react-icons/bi'
import { generatePath } from 'react-router-dom'
import { BlockIconLink, TxIconLink } from '~components/Layout/IconLink'
import LinkCard from '~components/Layout/LinkCard'
import { RoutePath } from '~constants'

export const EnvelopeCard = ({ envelope, count }: { envelope: VoteSummary; count: number }) => {
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
          <BlockIconLink height={envelope.blockHeight} />
          <TxIconLink block={envelope.blockHeight} index={envelope.transactionIndex} />
        </Flex>
      </CardBody>
    </LinkCard>
  )
}
