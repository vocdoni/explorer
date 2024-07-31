import { Flex, Heading, HStack, Tab, TabList, TabPanel, TabPanels, Text, VStack } from '@chakra-ui/react'
import { ensure0x, IChainValidator } from '@vocdoni/sdk'
import { Trans, useTranslation } from 'react-i18next'
import { DetailsGrid, GridItemProps } from '~components/Layout/DetailsGrid'
import { QueryParamsTabs } from '~components/Layout/QueryParamsTabs'
import { RawContentBox } from '~components/Layout/ShowRawButton'
import { ReducedTextAndCopy } from '~components/Layout/CopyButton'
import { BlockIconLink } from '~components/Layout/IconLink'
import { ValidatorName } from '~components/Validators/ValidatorCard'

export type ValidatorFixedType = IChainValidator & {
  // todo(kon): delete this type extension when https://github.com/vocdoni/vocdoni-sdk/pull/402 is merged
  joinHeight: number
  proposals: number
  score: number
  validatorAddress: string
  votes: number
}

const DetailsTab = ({ validator }: { validator: ValidatorFixedType }) => {
  const address = ensure0x(validator.address)
  const pubKey = ensure0x(validator.pubKey)

  const { t } = useTranslation()

  const details: GridItemProps[] = [
    {
      label: t('validators.pubKey', { defaultValue: 'Public Key' }),
      children: (
        <ReducedTextAndCopy
          breakPoint={{ base: true, lg: false }}
          p={0}
          color={'textAccent1'}
          toCopy={pubKey}
          fontWeight={'normal'}
          h={0}
          fontSize={'md'}
        >
          {pubKey}
        </ReducedTextAndCopy>
      ),
    },
    {
      label: t('validators.voting_power_cell', { defaultValue: 'Voting power' }),
      children: validator.power,
    },
    {
      label: t('validators.score', { defaultValue: 'Score' }),
      children: validator.score,
    },
    {
      label: t('validators.votes', { defaultValue: 'Votes' }),
      children: validator.votes,
    },
  ]

  return (
    <VStack align='start'>
      <DetailsGrid details={details} />
    </VStack>
  )
}

export const ValidatorDetail = ({ validator }: { validator: ValidatorFixedType }) => {
  const validatorAddress = ensure0x(validator.validatorAddress)
  const name = validator.name

  return (
    <Flex direction={'column'} mt={{ base: '20px', lg: '40px' }} gap={6} wordBreak='break-all'>
      <VStack align='start' spacing={4}>
        <Heading isTruncated wordBreak='break-word' mb={0}>
          <Trans i18nKey={'validators.validator_details'}>Validator Details</Trans>
        </Heading>
        <ValidatorName name={validator.name} address={validator.validatorAddress} />
        <HStack color={'lighterText'} fontWeight={'bold'}>
          <Text>
            <Trans i18nKey={'validators.validator_details'}>Joint on block</Trans>
          </Text>
          <BlockIconLink height={validator.joinHeight} />
        </HStack>
      </VStack>
      <QueryParamsTabs>
        <TabList display='flex' flexWrap='wrap'>
          <Tab>
            <Trans i18nKey={'process.tab_details'}>Details</Trans>
          </Tab>
          <Tab>
            <Trans i18nKey={'raw'}>Raw</Trans>
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <DetailsTab validator={validator} />
          </TabPanel>
          <TabPanel>
            <RawContentBox obj={validator} />
          </TabPanel>
        </TabPanels>
      </QueryParamsTabs>
    </Flex>
  )
}
