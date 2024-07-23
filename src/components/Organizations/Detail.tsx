import { Tab, TabList, TabPanel, TabPanels, VStack } from '@chakra-ui/react'
import { OrganizationHeader, OrganizationName } from '@vocdoni/chakra-components'
import { useOrganization } from '@vocdoni/react-providers'
import { Trans } from 'react-i18next'
import { ReducedTextAndCopy } from '~components/Layout/CopyButton'
import { HeroHeaderLayout } from '~components/Layout/HeroHeaderLayout'
import { QueryParamsTabs } from '~components/Layout/QueryParamsTabs'
import { RawContentBox } from '~components/Layout/ShowRawButton'
import { FallbackHeaderImg } from '~constants'
import { useAccountTransfersCount } from '~queries/organizations'
import AccountTransfers from '~components/Organizations/Details/Transfers'
import OrganizationElections from './Details/Elections'
import OrgDetails from './Details/OrgDetails'
import AccountFees from '~components/Organizations/Details/Fees'

const OrganizationDetail = () => {
  const { organization } = useOrganization()
  const { data } = useAccountTransfersCount({
    address: organization?.address || '',
  })

  // Should be already loaded
  if (!organization) return null

  const id = organization.address
  const transfersCount = data?.count

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
      <QueryParamsTabs isLazy>
        <TabList display='flex' flexWrap='wrap'>
          <Tab>
            <Trans i18nKey={'process.tab_details'}>Details</Trans>
          </Tab>
          <Tab>
            <Trans i18nKey={'organization.elections_count'} count={organization.electionIndex}>
              Elections ({{ count: organization.electionIndex }})
            </Trans>
          </Tab>
          <Tab>
            <Trans i18nKey={'organization.transfers_count'} count={transfersCount}>
              Transfers ({{ count: transfersCount }})
            </Trans>
          </Tab>
          <Tab>
            <Trans i18nKey={'organization.fees'}>Fees</Trans>
          </Tab>
          <Tab>
            <Trans i18nKey={'raw'}>Raw</Trans>
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <OrgDetails org={organization} />
          </TabPanel>
          <TabPanel>
            <OrganizationElections org={organization} />
          </TabPanel>
          <TabPanel>
            <AccountTransfers org={organization} txCount={transfersCount} />
          </TabPanel>
          <TabPanel>
            <AccountFees org={organization} />
          </TabPanel>
          <TabPanel>
            <RawContentBox obj={organization} />
          </TabPanel>
        </TabPanels>
      </QueryParamsTabs>
    </>
  )
}

export default OrganizationDetail
