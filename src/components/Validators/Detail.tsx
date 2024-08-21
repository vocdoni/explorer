import { Flex, Heading, HStack, Tab, TabList, TabPanel, TabPanels, Text, VStack } from '@chakra-ui/react'
import { ensure0x, IChainValidator } from '@vocdoni/sdk'
import { Trans, useTranslation } from 'react-i18next'
import { DetailsGrid, GridItemProps } from '~components/Layout/DetailsGrid'
import { RouteParamsTabs } from '~components/Layout/RouteParamsTabs'
import { RawContentBox } from '~components/Layout/ShowRawButton'
import { ReducedTextAndCopy } from '~components/Layout/CopyButton'
import { BlockIconLink } from '~components/Layout/IconLink'
import { ValidatorName } from '~components/Validators/ValidatorCard'
import { generatePath } from 'react-router-dom'
import { RoutePath } from '~constants'

const DetailsTab = ({ validator }: { validator: IChainValidator }) => {
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
      label: t('validators.account', { defaultValue: 'Account' }),
      children: (
        <ReducedTextAndCopy
          breakPoint={{ base: true, lg: false }}
          p={0}
          color={'textAccent1'}
          toCopy={address}
          fontWeight={'normal'}
          h={0}
          fontSize={'md'}
          to={generatePath(RoutePath.Account, { pid: address, tab: null, page: null })}
        >
          {address}
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

export const ValidatorDetail = ({ validator }: { validator: IChainValidator }) => {
  return (
    <Flex direction={'column'} mt={{ base: '20px', lg: '40px' }} gap={6} wordBreak='break-all'>
      <VStack align='start' spacing={4}>
        <Heading isTruncated wordBreak='break-word' mb={0}>
          <Trans i18nKey={'validators.validator_details'}>Validator Details</Trans>
        </Heading>
        <ValidatorName name={validator.name} address={validator.validatorAddress} useCopy />
        <HStack color={'lighterText'} fontWeight={'bold'}>
          <Text>
            <Trans i18nKey={'validators.validator_details'}>Joined on block</Trans>
          </Text>
          <BlockIconLink height={validator.joinHeight} />
        </HStack>
      </VStack>
      <RouteParamsTabs path={RoutePath.Validator}>
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
      </RouteParamsTabs>
    </Flex>
  )
}
