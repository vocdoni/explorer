import { Button, Flex, Heading, HStack, Tab, TabList, TabPanel, TabPanels, Text, VStack } from '@chakra-ui/react'
import { ensure0x, IChainValidator } from '@vocdoni/sdk'
import { Trans, useTranslation } from 'react-i18next'
import { DetailsGrid, GridItemProps } from '~components/Layout/DetailsGrid'
import { QueryParamsTabs } from '~components/Layout/QueryParamsTabs'
import { RawContentBox } from '~components/Layout/ShowRawButton'
import { ReducedTextAndCopy } from '~components/Layout/CopyButton'
import { HiOutlineCube } from 'react-icons/hi2'
import { RoutePath } from '~constants'
import { generatePath, Link as RouterLink } from 'react-router-dom'

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
        <Flex wrap={'wrap'} align={'baseline'} gap={2}>
          <ReducedTextAndCopy
            toCopy={validatorAddress}
            color={'textAccent1'}
            fontWeight={'normal'}
            h={0}
            fontSize={'xl'}
            p={0}
          >
            {validatorAddress}
          </ReducedTextAndCopy>
          {!!name && <Text color={'lighterText'}>({name})</Text>}
        </Flex>
        <HStack color={'lighterText'}>
          <Text fontWeight={'bold'}>
            <Trans i18nKey={'validators.validator_details'}>Joint on block</Trans>
          </Text>
          <Button
            p={0}
            variant={'text'}
            leftIcon={<HiOutlineCube />}
            as={RouterLink}
            to={generatePath(RoutePath.Block, { height: validator.joinHeight.toString(), page: null })}
          >
            {validator.joinHeight}
          </Button>
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
