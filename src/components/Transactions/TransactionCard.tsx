import { Box, CardBody, Flex, Tag, Text } from '@chakra-ui/react'
import { IChainTxReference, TransactionType } from '@vocdoni/sdk'
import { Trans } from 'react-i18next'
import { generatePath } from 'react-router-dom'
import { ReducedTextAndCopy } from '~components/Layout/CopyButton'
import { RoutePath } from '~constants'
import LinkCard from '~components/Layout/LinkCard'

export const TransactionTypeBadge = ({ transactionType }: { transactionType: TransactionType }) => {
  return (
    <Tag bg={'#f3fccc'} color={'#74af07'} variant={'vocdoni'}>
      {transactionType}
    </Tag>
  )
}

export const TransactionCard = ({
  transactionIndex,
  transactionType,
  transactionNumber,
  transactionHash,
  blockHeight,
}: IChainTxReference) => {
  return (
    <LinkCard
      to={generatePath(RoutePath.Transaction, {
        block: blockHeight.toString(),
        index: transactionIndex.toString(),
        tab: null,
      })}
    >
      <CardBody>
        <Flex gap={1} direction={'column'}>
          <Flex gap={3} direction={'column'}>
            <Box>
              <TransactionTypeBadge transactionType={transactionType} />
            </Box>
            <Text fontWeight='bold'># {transactionNumber}</Text>
          </Flex>
          <Box fontSize={'sm'}>
            <Flex gap={2} align={'center'}>
              <Trans i18nKey='blocks.proposer'>Hash:</Trans>
              <ReducedTextAndCopy color={'textAccent1'} toCopy={transactionHash}>
                {transactionHash}
              </ReducedTextAndCopy>
            </Flex>
          </Box>
        </Flex>
      </CardBody>
    </LinkCard>
  )
}
