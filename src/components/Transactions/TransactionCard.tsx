import { Box, CardBody, Flex, Icon, Tag, Text } from '@chakra-ui/react'
import { IChainTxReference } from '@vocdoni/sdk'
import { generatePath } from 'react-router-dom'
import { ReducedTextAndCopy } from '~components/Layout/CopyButton'
import { BlockIconLink } from '~components/Layout/IconLink'
import LinkCard from '~components/Layout/LinkCard'
import { RoutePath } from '~constants'
import { useDateFns } from '~i18n/use-date-fns'
import { useBlockToDate } from '~queries/stats'
import { Icons } from '~src/theme/components/Icons'

export const TransactionTypeBadge = ({ transactionType }: { transactionType: string }) => {
  return (
    <Tag bg={'#f3fccc'} color={'#74af07'} variant={'vocdoni'}>
      {transactionType}
    </Tag>
  )
}

export const TransactionCard = ({ index, hash, height, subtype, type }: IChainTxReference) => {
  const { formatDistance } = useDateFns()

  let _type = subtype
  if (!subtype || subtype === '') _type = type

  const { data } = useBlockToDate({ height })
  let date: Date | undefined
  if (data?.date) {
    date = new Date(data.date)
  }

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
            <TransactionTypeBadge transactionType={_type} />
            {date && (
              <Text fontWeight={100} color={'lighterText'}>
                {formatDistance(date, new Date())}
              </Text>
            )}
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
