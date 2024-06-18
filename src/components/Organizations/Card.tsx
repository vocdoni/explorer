import { Box, Card, CardBody, Flex, Text } from '@chakra-ui/react'
import { OrganizationImage as Avatar, OrganizationName } from '@vocdoni/chakra-components'
import { OrganizationProvider, useOrganization } from '@vocdoni/react-providers'
import { Trans, useTranslation } from 'react-i18next'
import { ReducedTextAndCopy } from '~components/CopyButton'

interface IOrganizationCardProps {
  id: string
  electionCount?: number
}

const OrganizationCard = ({ id, ...rest }: IOrganizationCardProps) => {
  return (
    <OrganizationProvider id={id}>
      <LargeOrganizationCard id={id} {...rest} />
    </OrganizationProvider>
  )
}

const LargeOrganizationCard = ({ id, electionCount }: IOrganizationCardProps) => {
  const { organization, loading } = useOrganization()
  const { t } = useTranslation()

  return (
    <Card direction={'row'} alignItems='center' pl={4}>
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
        {loading ? (
          <Text fontWeight={'bold'} wordBreak='break-all' size='sm'>
            {id}
          </Text>
        ) : (
          <OrganizationName fontWeight={'bold'} wordBreak='break-all' size='sm' />
        )}
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

export const SmallOrganizationCard = ({ id }: IOrganizationCardProps) => {
  const { organization } = useOrganization()
  const { t } = useTranslation()

  const name = organization?.account.name.default || organization?.address

  return (
    <Flex direction={'row'} alignItems='center' gap={2}>
      <Box w={'25px'}>
        <Avatar
          mx='auto'
          fallbackSrc={'/images/fallback-account-dark.png'}
          alt={t('organization.avatar_alt', {
            name: organization?.account.name.default || organization?.address,
          }).toString()}
        />
      </Box>
      <ReducedTextAndCopy color={'textAccent1'} size='sm' toCopy={id}>
        {name}
      </ReducedTextAndCopy>
    </Flex>
  )
}

export default OrganizationCard
