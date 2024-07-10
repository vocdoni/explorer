import { Box, Card, CardBody, CardProps, Flex, HStack, Link, Text, Wrap } from '@chakra-ui/react'
import { ElectionSchedule, ElectionTitle, OrganizationImage as Avatar } from '@vocdoni/chakra-components'
import { ElectionProvider, OrganizationProvider, useElection, useOrganization } from '@vocdoni/react-providers'
import { InvalidElection as InvalidElectionType, PublishedElection } from '@vocdoni/sdk'
import { useTranslation } from 'react-i18next'
import { generatePath, Link as RouterLink } from 'react-router-dom'
import { ReducedTextAndCopy } from '~components/Layout/CopyButton'
import { ElectionStatusBadge } from '~components/Organizations/StatusBadge'
import InvalidElection from '~components/Process/InvalidElection'
import { RoutePath } from '~constants'

export type ElectionCardProps = { id?: string; election?: PublishedElection } & CardProps

/**
 * Show election card information. If not id or election provided will asume it is already inside an ElectionProvider
 * @param id If id provided it will fetch the election from the API
 * @param election already loaded election info to show
 * @param rest chakra CardProps
 * @constructor
 */
export const ElectionCard = ({ id, election, ...rest }: ElectionCardProps) => {
  if (!id && !election) return <ElectionCardSkeleton {...rest} />

  return (
    <ElectionProvider id={id} election={election}>
      <ElectionCardSkeleton {...rest} />
    </ElectionProvider>
  )
}

const ElectionCardSkeleton = (rest: CardProps) => {
  const { election } = useElection()

  if (!election) return null
  if (election instanceof InvalidElectionType) {
    return <InvalidElection />
  }

  return (
    <Card direction={'row'} alignItems='center' pl={4} {...rest}>
      <Link as={RouterLink} to={generatePath(RoutePath.Process, { pid: election.id })} w='full'>
        <CardBody>
          <Flex direction={'column'} align={'start'} gap={4}>
            <HStack>
              <ElectionStatusBadge status={election.status} />
              <ElectionSchedule
                showRemaining
                fontWeight={'normal'}
                fontSize={'sm'}
                textAlign={'start'}
                fontStyle={'normal'}
              />
            </HStack>
            <ElectionTitle textAlign={'start'} fontWeight={'bold'} wordBreak='break-all' fontSize='lg' />
          </Flex>
          <OrganizationProvider id={election.organizationId}>
            <SmallOrganizationCard id={election.organizationId} />
          </OrganizationProvider>
        </CardBody>
      </Link>
    </Card>
  )
}

const SmallOrganizationCard = ({ id }: { id: string }) => {
  const { organization } = useOrganization()
  const { t } = useTranslation()

  const orgName = organization?.account.name.default

  return (
    <Flex direction={'row'} alignItems='center' gap={2}>
      <Box w={'30px'} minW={'30px'}>
        <Avatar
          mx='auto'
          fallbackSrc={'/images/fallback-account-dark.png'}
          alt={t('organization.avatar_alt', {
            name: orgName || organization?.address,
          }).toString()}
        />
      </Box>
      <Wrap spacingX={2} spacingY={0} align={'center'}>
        {orgName && (
          <Text
            as={RouterLink}
            to={generatePath(RoutePath.Organization, { pid: organization?.address, page: null })}
            color={'textAccent1'}
            size='xs'
            fontWeight={'normal'}
            variant={'text'}
            pl={0}
            wordBreak='break-all'
          >
            {orgName}
          </Text>
        )}
        <ReducedTextAndCopy
          breakPoint={{ base: true }}
          color={'textAccent1'}
          size='sm'
          toCopy={id}
          to={generatePath(RoutePath.Organization, { pid: id, page: null })}
          pl={0}
          fontWeight={'normal'}
        >
          {id}
        </ReducedTextAndCopy>
      </Wrap>
    </Flex>
  )
}
