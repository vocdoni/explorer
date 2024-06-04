import { Card, CardBody, Flex, Text } from '@chakra-ui/react'
import { formatDistance } from 'date-fns'
import { Trans } from 'react-i18next'
import { ReducedTextAndCopy } from '~components/CopyBtn'

export const BlockCard = ({ height, time, proposer }: { height: number; time: string; proposer: string }) => {
  const date = new Date(time)

  return (
    <Card>
      <CardBody>
        <Flex gap={3} direction={'column'}>
          <Flex gap={3}>
            <Text fontWeight='bold'># {height}</Text>
            <Text fontWeight={100} color={'lighterText'}>
              {formatDistance(date, new Date(), { addSuffix: true })}
            </Text>
          </Flex>
          <Text fontSize={'sm'}>
            <Flex gap={2}>
              <Trans i18nKey='blocks.proposer'>Proposer:</Trans>
              <Text color={'textAccent1'}>
                <ReducedTextAndCopy text={proposer} toCopy={proposer} />
              </Text>
            </Flex>
          </Text>
        </Flex>
      </CardBody>
    </Card>
  )
}
