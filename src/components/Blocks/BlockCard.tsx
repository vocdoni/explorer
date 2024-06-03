import { Card, CardBody, Flex, Text } from '@chakra-ui/react'
import { formatDistance } from 'date-fns'

export const BlockCard = ({ height, time, proposer }: { height: number; time: string; proposer: string }) => {
  const date = new Date(time)

  return (
    <Card>
      <CardBody>
        <Flex gap={3}>
          <Text fontWeight='bold'># {height}</Text>
          <Text fontWeight={100} color={'gray'}>
            {formatDistance(date, new Date(), { addSuffix: true })}
          </Text>
        </Flex>

        <Text>{proposer}</Text>
      </CardBody>
    </Card>
  )
}
