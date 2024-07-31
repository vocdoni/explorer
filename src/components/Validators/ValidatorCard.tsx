import { Card, CardBody, Flex, HStack, Link, Text, TextProps } from '@chakra-ui/react'
import { Trans } from 'react-i18next'
import { ReducedTextAndCopy, ReducedTextAndCopyProps } from '~components/Layout/CopyButton'
import { generatePath, Link as RouterLink } from 'react-router-dom'
import { RoutePath } from '~constants'
import { ValidatorFixedType } from '~components/Validators/Detail'

export const ValidatorName = ({
  name,
  address,
  nameProps,
  addressProps,
}: {
  name?: string
  address: string
  nameProps?: TextProps
  addressProps?: Omit<ReducedTextAndCopyProps, 'toCopy'>
}) => {
  const showName = !!name
  return (
    <Flex wrap={'wrap'} align={'baseline'} gap={2} wordBreak='break-all'>
      {showName && (
        <Text fontWeight={'bold'} fontSize={'xl'} {...nameProps}>
          {name}
        </Text>
      )}
      <ReducedTextAndCopy
        color={'textAccent1'}
        fontWeight={'normal'}
        h={0}
        px={0}
        my={3}
        toCopy={address}
        fontSize={showName ? 'sm' : 'xl'}
        {...addressProps}
      >
        {address}
      </ReducedTextAndCopy>
    </Flex>
  )
}

export const ValidatorCard = (validator: ValidatorFixedType) => {
  return (
    <Card>
      <Link as={RouterLink} to={generatePath(RoutePath.Validator, { address: validator.validatorAddress })}>
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
      </Link>
    </Card>
  )
}
