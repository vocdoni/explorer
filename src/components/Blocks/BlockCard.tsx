import { Box, Card, CardBody, Flex, HStack, Icon, Text } from '@chakra-ui/react'
import { BlockError, BlockNotFoundError } from '@vocdoni/extended-sdk'
import { IChainBlockInfoResponse } from '@vocdoni/sdk'
import { Trans, useTranslation } from 'react-i18next'
import { BiTransferAlt } from 'react-icons/bi'
import { generatePath } from 'react-router-dom'
import { ReducedTextAndCopy } from '~components/Layout/CopyButton'
import LinkCard from '~components/Layout/LinkCard'
import { RoutePath } from '~constants'
import { useDateFns } from '~i18n/use-date-fns'

export const BlockCard = ({ block }: { block: IChainBlockInfoResponse | BlockError }) => {
  if (block instanceof BlockError) return <BlockErrorCard error={block} height={block.height} />
  return (
    <BlockInfoCard
      height={block.header.height}
      time={block.header.time}
      proposer={block.header.proposerAddress}
      txn={block.data.txs.length}
    />
  )
}

const BlockInfoCard = ({
  height,
  time,
  proposer,
  txn,
}: {
  height: number
  time: string
  proposer: string
  txn: number
}) => {
  const date = new Date(time)
  const { formatDistance } = useDateFns()

  return (
    <LinkCard to={generatePath(RoutePath.Block, { height: height.toString(), tab: null, page: null })}>
      <CardBody>
        <Flex gap={1} direction={'column'}>
          <Flex gap={3}>
            <Text fontWeight='bold'># {height}</Text>
            <HStack spacing={1}>
              <Icon as={BiTransferAlt} boxSize={5} />
              <Text fontSize={'sm'} fontWeight={'bold'}>
                {txn}
              </Text>
            </HStack>
            <Text fontWeight={100} color={'lighterText'}>
              {formatDistance(date, new Date())}
            </Text>
          </Flex>
          <Box fontSize={'sm'}>
            <Flex gap={2} align={'center'}>
              <Trans i18nKey='blocks.proposer'>Proposer:</Trans>
              <ReducedTextAndCopy color={'textAccent1'} toCopy={proposer}>
                {proposer}
              </ReducedTextAndCopy>
            </Flex>
          </Box>
        </Flex>
      </CardBody>
    </LinkCard>
  )
}

const BlockErrorCard = ({ height, error }: { height: number; error: BlockError }) => {
  const { t } = useTranslation()

  let message = error.message
  if (error instanceof BlockNotFoundError) {
    message = t('blocks.block_not_found')
  }

  return (
    <Card>
      <CardBody>
        <Text fontWeight='bold'># {height}</Text>
        {message}
      </CardBody>
    </Card>
  )
}
