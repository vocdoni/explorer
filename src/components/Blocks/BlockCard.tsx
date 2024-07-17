import { Box, Card, CardBody, Flex, Link, Text } from '@chakra-ui/react'
import { BlockError, BlockNotFoundError } from '@vocdoni/extended-sdk'
import { IChainBlockInfoResponse } from '@vocdoni/sdk'
import { Trans, useTranslation } from 'react-i18next'
import { generatePath, Link as RouterLink } from 'react-router-dom'
import { ReducedTextAndCopy } from '~components/Layout/CopyButton'
import { RoutePath } from '~constants'
import { useDateFns } from '~i18n/use-date-fns'

export const BlockCard = ({ block }: { block: IChainBlockInfoResponse | BlockError }) => {
  if (block instanceof BlockError) return <BlockErrorCard error={block} height={block.height} />
  return <BlockInfoCard height={block.header.height} time={block.header.time} proposer={block.header.proposerAddress} />
}

const BlockInfoCard = ({ height, time, proposer }: { height: number; time: string; proposer: string }) => {
  const date = new Date(time)
  const { formatDistance } = useDateFns()

  return (
    <Card>
      <Link as={RouterLink} to={generatePath(RoutePath.Block, { height: height.toString(), page: null })}>
        <CardBody>
          <Flex gap={1} direction={'column'}>
            <Flex gap={3}>
              <Text fontWeight='bold'># {height}</Text>
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
      </Link>
    </Card>
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
