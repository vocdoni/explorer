import { Box, Card, CardBody, Text } from '@chakra-ui/react'
import { Trans, useTranslation } from 'react-i18next'
import { ReducedTextAndCopy } from '~components/CopyBtn'
import { OrganizationProvider, useOrganization } from '@vocdoni/react-providers'
import { OrganizationAvatar as Avatar, OrganizationName } from '@vocdoni/chakra-components'

interface IOrganizationCardProps {
  id: string
  electionCount?: number
}

const OrganizationCard = ({ id, ...rest }: IOrganizationCardProps) => {
  return (
    <OrganizationProvider id={id}>
      <OrganizationCardContent id={id} {...rest} />
    </OrganizationProvider>
  )
}

const OrganizationCardContent = ({ id, electionCount }: IOrganizationCardProps) => {
  const { organization } = useOrganization()
  const { t } = useTranslation()

  return (
    <Card direction={'row'} alignItems='center' overflow={'scroll'} pl={4}>
      <Box w={'50px'}>
        <Avatar
          mx='auto'
          fallbackSrc={'/images/fallback-account-dark.png'}
          alt={t('organization.avatar_alt', {
            name: organization?.account.name.default || organization?.address,
          }).toString()}
        />
      </Box>
      <CardBody>
        <OrganizationName fontWeight={'bold'} wordBreak='break-all' size='sm' />
        <ReducedTextAndCopy color={'textAccent1'} toCopy={id}>
          {id}
        </ReducedTextAndCopy>
        <Text fontSize={'sm'}>
          <Trans i18nKey={'organization.process_count'} count={electionCount}>
            <strong>Process:</strong> {{ count: electionCount }}
          </Trans>
        </Text>
      </CardBody>
    </Card>
  )
}

export default OrganizationCard
