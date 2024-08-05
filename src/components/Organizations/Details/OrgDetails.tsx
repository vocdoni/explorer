import { Flex, Icon, Link } from '@chakra-ui/react'
import { OrganizationDescription } from '@vocdoni/chakra-components'
import { AccountData, ensure0x } from '@vocdoni/sdk'
import { Trans, useTranslation } from 'react-i18next'
import { FaUserAlt } from 'react-icons/fa'
import { DetailsGrid, GridItemProps } from '~components/Layout/DetailsGrid'
import { AppBaseURL } from '~constants'

const OrgDetails = ({ org }: { org: AccountData }) => {
  const { t } = useTranslation()

  const details: GridItemProps[] = [
    {
      label: t('organization.nonce', { defaultValue: 'Nonce' }),
      children: org.nonce,
    },
    {
      label: t('organization.balance', { defaultValue: 'Balance' }),
      children: org.balance,
    },
    {
      label: t('organization.election_count', { defaultValue: 'Elections' }),
      children: org.electionIndex,
    },
    {
      label: t('organization.profile', { defaultValue: 'Profile' }),
      children: (
        <Link target='blank' href={`${AppBaseURL}/organization/${ensure0x(org.address)}`}>
          <Icon as={FaUserAlt} boxSize={3} mr={2} />
          <Trans i18nKey={'organization.view_profile'}></Trans>
        </Link>
      ),
    },
    ...(org.account.description.default
      ? [
          {
            label: t('organization.description', { defaultValue: 'Description' }),
            children: <OrganizationDescription />,
          },
        ]
      : []),
  ]
  return (
    <Flex align='start' gap={2} direction={'column'}>
      <DetailsGrid details={details} />
    </Flex>
  )
}

export default OrgDetails
