import { Box, Card, CardBody, Flex, Text } from '@chakra-ui/react'
import { formatDistance } from 'date-fns'
import { Trans } from 'react-i18next'
import { ReducedTextAndCopy } from '~components/CopyBtn'
import { dateLocales } from '~i18n/locales'
import i18n from '~i18n'

export const BlockCard = ({ height, time, proposer }: { height: number; time: string; proposer: string }) => {
  const date = new Date(time)
  const locale = dateLocales[i18n.language]

  return (
    <Card>
      <CardBody>
        <Flex gap={1} direction={'column'}>
          <Flex gap={3}>
            <Text fontWeight='bold'># {height}</Text>
            <Text fontWeight={100} color={'lighterText'}>
              {formatDistance(date, new Date(), { addSuffix: true, locale })}
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
    </Card>
  )
}
