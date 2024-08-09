import { Box, Card, CardBody, Flex, Link, HStack, Icon, Text } from '@chakra-ui/react'
import { BlockError, BlockNotFoundError } from '@vocdoni/extended-sdk'
import { IChainBlockInfoResponse } from '@vocdoni/sdk'
import { Trans, useTranslation } from 'react-i18next'
import { BiTransferAlt } from 'react-icons/bi'

import { generatePath, Link as RouterLink } from 'react-router-dom'
import { ReducedTextAndCopy } from '~components/Layout/CopyButton'
import LinkCard from '~components/Layout/LinkCard'
import { RoutePath } from '~constants'
import { useDateFns } from '~i18n/use-date-fns'
import { Icons } from '~src/theme/components/Icons'

interface IBlockCardProps {
  block: IChainBlockInfoResponse | BlockError
  compact?: boolean
}

export const BlockCard = ({ block, compact = false }: IBlockCardProps) => {
  const { formatDistance } = useDateFns()
  if (block instanceof BlockError) return <BlockErrorCard error={block} height={block.height} />

  const height = block.header.height
  const time = block.header.time
  const proposer = block.header.proposerAddress
  const txn = block.data.txs.length

  const date = new Date(time)

  return (
    <LinkCard to={generatePath(RoutePath.Block, { height: height.toString(), tab: null, page: null })}>
      <CardBody>
        <Flex gap={1} direction={'column'}>
          <Flex gap={3}>
            <Text fontWeight='bold'># {height}</Text>
            <HStack spacing={1}>
              <Icon as={Icons.TxIcon} boxSize={5} />
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
              <ReducedTextAndCopy
                breakPoint={compact ? { base: true } : undefined}
                color={'textAccent1'}
                toCopy={proposer}
              >
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
