import { Box, CardBody, Flex, HStack, Icon, Text } from '@chakra-ui/react'
import { IBlock } from '@vocdoni/sdk'
import { Trans } from 'react-i18next'

import { generatePath } from 'react-router-dom'
import { ReducedTextAndCopy } from '~components/Layout/CopyButton'
import LinkCard from '~components/Layout/LinkCard'
import { RoutePath } from '~constants'
import { useDateFns } from '~i18n/use-date-fns'
import { Icons } from '~src/theme/components/Icons'

interface IBlockCardProps {
  block: IBlock
  compact?: boolean
}

export const BlockCard = ({ block, compact = false }: IBlockCardProps) => {
  const { formatDistance } = useDateFns()

  const { height, time, proposer, txCount } = block

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
                {txCount}
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
