import { Tab, TabList, TabPanel, TabPanels, VStack } from '@chakra-ui/react'
import { OrganizationHeader, OrganizationName } from '@vocdoni/chakra-components'
import { useOrganization } from '@vocdoni/react-providers'
import { Trans, useTranslation } from 'react-i18next'
import { ReducedTextAndCopy } from '~components/Layout/CopyButton'
import { HeroHeaderLayout } from '~components/Layout/HeroHeaderLayout'
import { RouteParamsTabs } from '~components/Layout/RouteParamsTabs'
import { RawContentBox } from '~components/Layout/ShowRawButton'
import { FallbackHeaderImg, RoutePath } from '~constants'
import AccountTransfers from '~components/Accounts/Details/Transfers'
import AccountElections from './Details/Elections'
import AccountDetails from './Details/AccountDetails'
import AccountFees from '~components/Accounts/Details/Fees'
import TextAndTag from '~components/Layout/TextAndTag'

const AccountDetail = () => {
  const { organization } = useOrganization()

  const { t } = useTranslation()

  // Should be already loaded
  if (!organization) return null

  const id = organization.address
  const transfersCount = organization.transfersCount ?? 0
  const feesCount = organization.feesCount ?? 0

  return (
    <>
      <HeroHeaderLayout header={<OrganizationHeader fallbackSrc={FallbackHeaderImg} />}>
        <VStack>
          <OrganizationName fontSize='4xl' wordBreak='break-word' textAlign={'center'} />
          <ReducedTextAndCopy color={'textAccent1'} toCopy={id} fontWeight={'normal'} h={0} fontSize={'md'}>
            {id}
          </ReducedTextAndCopy>
        </VStack>
      </HeroHeaderLayout>
      <RouteParamsTabs path={RoutePath.Account} isLazy>
        <TabList display='flex' flexWrap='wrap'>
          <Tab>
            <Trans i18nKey={'process.tab_details'}>Details</Trans>
          </Tab>
          <Tab>
            <TextAndTag
              text={t('account.elections_count', { defaultValue: 'Elections' })}
              tagLabel={organization.electionIndex.toString()}
            />
          </Tab>
          <Tab>
            <TextAndTag
              text={t('account.transfers_count', { defaultValue: 'Transfers' })}
              tagLabel={transfersCount?.toString() ?? '0'}
            />
          </Tab>
          <Tab>
            <TextAndTag
              text={t('account.fees.fees', { defaultValue: 'Fees' })}
              tagLabel={feesCount?.toString() ?? '0'}
            />
          </Tab>
          <Tab>
            <Trans i18nKey={'raw'}>Raw</Trans>
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <AccountDetails />
          </TabPanel>
          <TabPanel>
            <AccountElections />
          </TabPanel>
          <TabPanel>
            <AccountTransfers />
          </TabPanel>
          <TabPanel>
            <AccountFees />
          </TabPanel>
          <TabPanel>
            <RawContentBox obj={organization} />
          </TabPanel>
        </TabPanels>
      </RouteParamsTabs>
    </>
  )
}

export default AccountDetail
