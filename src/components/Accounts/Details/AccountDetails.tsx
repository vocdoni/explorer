import { Flex, Icon, Link } from '@chakra-ui/react'
import { OrganizationDescription } from '@vocdoni/chakra-components'
import { ensure0x } from '@vocdoni/sdk'
import { Trans, useTranslation } from 'react-i18next'
import { FaUserAlt } from 'react-icons/fa'
import { DetailsGrid, GridItemProps } from '~components/Layout/DetailsGrid'
import { AppBaseURL } from '~constants'
import { useOrganization } from '@vocdoni/react-providers'

const AccountDetails = () => {
  const { t } = useTranslation()
  const { organization: org } = useOrganization()

  if (!org) return null

  const details: GridItemProps[] = [
    {
      label: t('account.nonce', { defaultValue: 'Nonce' }),
      children: org.nonce,
    },
    {
      label: t('account.balance', { defaultValue: 'Balance' }),
      children: org.balance,
    },
    {
      label: t('account.elections_count', { defaultValue: 'Elections' }),
      children: org.electionIndex,
    },
    {
      label: t('account.profile', { defaultValue: 'Profile' }),
      children: (
        <Link target='blank' href={`${AppBaseURL}/organization/${ensure0x(org.address)}`}>
          <Icon as={FaUserAlt} boxSize={3} mr={2} />
          <Trans i18nKey={'account.view_profile'}></Trans>
        </Link>
      ),
    },
    ...(org.account.description.default
      ? [
          {
            label: t('account.description', { defaultValue: 'Description' }),
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

export default AccountDetails
