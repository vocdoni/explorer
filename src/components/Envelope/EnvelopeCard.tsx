import { Box, CardBody, CardHeader, Flex, Icon, Skeleton, Text } from '@chakra-ui/react'
import { VoteSummary } from '@vocdoni/sdk'
import { Trans } from 'react-i18next'
import { BiEnvelope } from 'react-icons/bi'
import { generatePath } from 'react-router-dom'
import { BlockIconLink, TxIconLink } from '~components/Layout/IconLink'
import LinkCard from '~components/Layout/LinkCard'
import { RoutePath } from '~constants'

export const EnvelopeCard = ({
  envelope,
  count,
  isLoading,
}: {
  envelope: VoteSummary
  count: number
  isLoading?: boolean
}) => {
  return (
    <LinkCard to={generatePath(RoutePath.Envelope, { verifier: envelope.voteID, tab: null })} maxW='xs'>
      <CardHeader>
        <Flex justify={'space-between'}>
          <Skeleton isLoaded={!isLoading} fitContent>
            <Text fontWeight={'bold'}>
              <Trans i18nKey={'envelopes.envelope_number'} num={count}>
                Envelope nº {{ num: count }}
              </Trans>
            </Text>
          </Skeleton>
          <Skeleton isLoaded={!isLoading} fitContent>
            <Box>
              <Icon color={'lightText'} as={BiEnvelope} />
            </Box>
          </Skeleton>
        </Flex>
      </CardHeader>
      <CardBody>
        <Flex direction={'column'}>
          <Skeleton isLoaded={!isLoading} fitContent>
            <BlockIconLink height={envelope.blockHeight} />
          </Skeleton>
          <Skeleton isLoaded={!isLoading} fitContent>
            <TxIconLink block={envelope.blockHeight} index={envelope.transactionIndex} />
          </Skeleton>
        </Flex>
      </CardBody>
    </LinkCard>
  )
}
