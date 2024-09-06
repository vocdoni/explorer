import { Box, CardBody, Flex, Icon, Tag } from '@chakra-ui/react'
import { IChainTxReference } from '@vocdoni/sdk'
import { generatePath } from 'react-router-dom'
import { ReducedTextAndCopy } from '~components/Layout/CopyButton'
import { BlockIconLink } from '~components/Layout/IconLink'
import LinkCard from '~components/Layout/LinkCard'
import { RoutePath } from '~constants'
import { Icons } from '~src/theme/components/Icons'

export const TransactionTypeBadge = ({ transactionType }: { transactionType: string }) => {
  return (
    <Tag bg={'#f3fccc'} color={'#74af07'} variant={'vocdoni'}>
      {transactionType}
    </Tag>
  )
}

export const TransactionCard = ({ index, hash, height, subtype }: IChainTxReference) => {
  return (
    <LinkCard
      to={generatePath(RoutePath.Transaction, {
        block: height.toString(),
        index: index.toString(),
        tab: null,
      })}
    >
      <CardBody>
        <Flex gap={3} direction={'column'}>
          <Flex gap={2}>
            <TransactionTypeBadge transactionType={subtype} />
          </Flex>

          <Flex align='center' gap={2}>
            <Icon as={Icons.TxIcon} />
            <Box>{index}</Box>
            <BlockIconLink height={height} />
          </Flex>

          <Flex gap={2} align={'center'}>
            <ReducedTextAndCopy fontSize={'sm'} color={'textAccent1'} toCopy={hash}>
              {hash}
            </ReducedTextAndCopy>
          </Flex>
        </Flex>
      </CardBody>
    </LinkCard>
  )
}
