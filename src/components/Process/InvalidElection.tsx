import { Text, TextProps } from '@chakra-ui/react'
import { Trans } from 'react-i18next'

const InvalidElection = (props: TextProps) => {
  return (
    <Text {...props}>
      <Trans i18nKey={'processes.invalid_election'}>Invalid Election</Trans>
    </Text>
  )
}

export default InvalidElection
