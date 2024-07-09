import { Card, CardBody, Flex, HStack, Text } from '@chakra-ui/react'
import { ensure0x, IChainValidator } from '@vocdoni/sdk'
import { Trans } from 'react-i18next'
import { ReducedTextAndCopy } from '~components/Layout/CopyButton'

export const ValidatorCard = (validator: IChainValidator) => {
  return (
    <Card>
      <CardBody>
        <Flex gap={2} direction={'column'}>
          <Text fontWeight='bold' wordBreak='break-all'>
            {ensure0x(validator.address)}
          </Text>
          <Flex fontSize={'sm'} direction={'column'} gap={2}>
            <HStack gap={1}>
              <Text fontWeight={'bold'}>
                <Trans i18nKey='validators.pubkey'>PubKey:</Trans>
              </Text>
              <ReducedTextAndCopy
                color={'textAccent1'}
                toCopy={validator.pubKey}
                fontWeight={'normal'}
                h={0}
                fontSize={'sm'}
                p={0}
              >
                {validator.pubKey}
              </ReducedTextAndCopy>
            </HStack>
            <Text fontWeight={'bold'}>
              <Trans i18nKey='validators.voting_power' values={{ power: validator.power }}>
                Voting power: {{ power: validator.power }}
              </Trans>
            </Text>
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  )
}
