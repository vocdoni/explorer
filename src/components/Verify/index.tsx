import addVote from '/images/add-vote.svg'
import { Box, Button, Flex, Image, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { generatePath, useNavigate, useParams } from 'react-router-dom'
import { InputSearch } from '~components/Layout/Inputs'
import { RoutePath } from '~constants'

const SearchVote = ({ compact }: { compact?: boolean }) => {
  const { verifier: urlVerifier }: { verifier?: string } = useParams()

  const { t } = useTranslation()
  const navigate = useNavigate()
  const [verifier, setVerifier] = useState(urlVerifier ?? '')

  return (
    <Flex direction={compact ? 'row' : 'column'} gap={2} align={'center'} w={'full'}>
      <InputSearch
        w='full'
        placeholder={t('verify.add_your_vote_id')}
        onChange={(value: string) => {
          setVerifier(value)
        }}
        initialValue={urlVerifier}
      />
      <Box>
        <Button
          onClick={() => {
            navigate(generatePath(RoutePath.Verify, { verifier }))
          }}
        >
          <Trans i18nKey={'verify.verify'}>Verify</Trans>
        </Button>
      </Box>
    </Flex>
  )
}

export const VerifyForm = () => {
  const { t } = useTranslation()

  return (
    <Flex direction={'column'} mt={'40px'} gap={6} alignItems={'center'}>
      <Image w={'100px'} src={addVote} alt={t('envelopes.vote_registered')} />
      <Box alignSelf={'start'}>
        <Text fontSize={'2xl'} color={'blueText'}>
          <Trans i18nKey={'verify.title'}>Verify your vote</Trans>
        </Text>
        <Text fontSize={'md'} color={'lightText'} alignSelf={'start'}>
          <Trans i18nKey={'verify.subtitle'}>
            Enter the voting receipt you received after voting to verify your vote
          </Trans>
        </Text>
      </Box>
      <SearchVote />
    </Flex>
  )
}

export const VerifyFormMinified = ({ compact }: { compact?: boolean }) => {
  const { t } = useTranslation()

  return (
    <Flex direction={'column'} mt={'40px'} gap={12} alignItems={'start'}>
      <Flex gap={3} alignItems={'start'}>
        <Image w={'30px'} src={addVote} alt={t('envelopes.vote_registered')} />
        <Text fontSize={'2xl'} color={'blueText'}>
          <Trans i18nKey={'verify.title'}>Verify your vote</Trans>
        </Text>
      </Flex>
      <SearchVote compact />
    </Flex>
  )
}
