import { Box, Card, CardBody, Flex, Link, Text } from '@chakra-ui/react'
import { Trans } from 'react-i18next'
import { generatePath, Link as RouterLink } from 'react-router-dom'
import { ReducedTextAndCopy } from '~components/Layout/CopyButton'
import { RoutePath } from '~constants'
import { useDateFns } from '~i18n/use-date-fns'

export const BlockCard = ({ height, time, proposer }: { height: number; time: string; proposer: string }) => {
  const date = new Date(time)
  const { formatDistance } = useDateFns()

  return (
    <Card>
      <Link as={RouterLink} to={generatePath(RoutePath.Block, { height: height.toString() })}>
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
                <ReducedTextAndCopy reduced={true} color={'textAccent1'} toCopy={proposer}>
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
