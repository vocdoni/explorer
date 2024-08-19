import { CardBody, Flex, HStack, Text } from '@chakra-ui/react'
import { Trans } from 'react-i18next'
import { ReducedTextAndCopy } from '~components/Layout/CopyButton'
import { generatePath } from 'react-router-dom'
import { RoutePath } from '~constants'
import LinkCard from '~components/Layout/LinkCard'
import { IChainValidator } from '@vocdoni/sdk'

export const ValidatorName = ({ name, useCopy, address }: { name?: string; useCopy?: boolean; address: string }) => {
  const showName = !!name
  let addrsComponent = (
    <Text fontWeight={'normal'} fontSize={showName ? 'sm' : 'xl'}>
      {address}
    </Text>
  )
  if (useCopy) {
    addrsComponent = (
      <ReducedTextAndCopy
        color={'textAccent1'}
        fontWeight={'normal'}
        h={0}
        px={0}
        my={3}
        toCopy={address}
        fontSize={showName ? 'sm' : 'xl'}
      >
        {address}
      </ReducedTextAndCopy>
    )
  }
  return (
    <Flex wrap={'wrap'} align={'baseline'} gap={2} wordBreak='break-all'>
      {showName && (
        <Text fontWeight={'bold'} fontSize={'xl'}>
          {name}
        </Text>
      )}
      {addrsComponent}
    </Flex>
  )
}

export const ValidatorCard = (validator: IChainValidator) => {
  return (
    <LinkCard to={generatePath(RoutePath.Validator, { address: validator.validatorAddress, tab: null })}>
      <CardBody>
        <Flex gap={2} direction={'column'}>
          <ValidatorName name={validator.name} address={validator.validatorAddress} />
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
    </LinkCard>
  )
}
