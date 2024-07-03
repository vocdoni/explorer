import { Flex, Heading, Image, Link, Text } from '@chakra-ui/react'
import { IVoteInfoResponse } from '@vocdoni/sdk'
import { formatDistance } from 'date-fns'
import { Trans, useTranslation } from 'react-i18next'
import { generatePath, Link as RouterLink } from 'react-router-dom'
import { RoutePath } from '~constants'
import ShowRawButton from '~components/Layout/ShowRawButton'
import voteImage from '/images/vocdoni-vote.png'

const EnvelopeDetail = (envelope: IVoteInfoResponse) => {
  const { t } = useTranslation()
  const emitted = formatDistance(new Date(envelope.date), new Date(), { addSuffix: true })
  const encKeys = envelope.encryptionKeys?.join(',')

  return (
    <Flex direction={'column'} mt={'40px'} gap={6} wordBreak='break-all'>
      <Heading isTruncated wordBreak='break-word'>
        <Trans i18nKey={'envelopes.envelope_detail'}>Envelope Detail</Trans>
      </Heading>
      <Flex direction={'column'} alignItems={'center'} gap={6}>
        <Image w={'100px'} src={voteImage} alt={t('envelopes.vote_registered')} />
        <Text fontWeight={'bold'} fontSize={'xl'}>
          <Trans i18nKey={'envelopes.registered_correctly'}>Vote has been registered correctly</Trans>
        </Text>
        <Flex direction={'column'} gap={1} alignItems={'center'}>
          <Text fontWeight={'bold'} fontSize={'md'}>
            <Trans i18nKey={'envelopes.verifier_code'}>Verifier code</Trans>
          </Text>
          <Text>{envelope.voteID}</Text>
        </Flex>
      </Flex>
      <Flex direction={'column'} gap={3}>
        <Text>
          <Trans i18nKey={'envelopes.emitted'} values={{ emitted: emitted }}>
            Emitted {{ emitted: emitted }}
          </Trans>
        </Text>
        {encKeys && encKeys?.length > 0 && (
          <Text>
            <Trans i18nKey={'envelopes.encryption_keys'} values={{ encKeys: encKeys }}>
              Encryption keys: {{ encKeys: encKeys }}
            </Trans>
          </Text>
        )}
        {envelope.overwriteCount > 0 && (
          <Text>
            <Trans i18nKey='envelopes.overwrite_count' values={{ overwriteCount: envelope.overwriteCount }}>
              Overwrite count: {{ overwriteCount: envelope.overwriteCount }}
            </Trans>
          </Text>
        )}
        <Text>
          <Trans i18nKey={'envelopes.envelope_weight'} values={{ weight: envelope.weight }}>
            Envelope weight: {{ weight: envelope.weight }}
          </Trans>
        </Text>
        <Text>
          <Trans
            i18nKey={'envelopes.committed_in_block'}
            components={{
              a: (
                <Link as={RouterLink} to={generatePath(RoutePath.Block, { height: envelope.blockHeight.toString() })} />
              ),
            }}
            values={{ block: envelope.blockHeight }}
          />
        </Text>
        <Text>
          <Trans
            i18nKey={'envelopes.belongs_to_process'}
            components={{
              a: <Link as={RouterLink} to={generatePath(RoutePath.Process, { pid: envelope.electionID })} />,
            }}
            values={{ pid: envelope.electionID }}
          />
        </Text>
      </Flex>
      <ShowRawButton obj={envelope} />
    </Flex>
  )
}

export default EnvelopeDetail
