import { Box, Flex, Text } from '@chakra-ui/react'
import { Trans } from 'react-i18next'
import { FeaturedContent } from '~components/Home/FeaturedContent'
import Stats from '~components/Stats'

const LandingPage = () => {
  return (
    <>
      <Box
        w='full'
        h='400px'
        sx={{
          background: 'linear-gradient(180deg, #f0ffde 20.98%, #e0ffff 73.1%, transparent 100%, transparent 100%)',
        }}
        position='absolute'
        left={0}
        zIndex={-1}
      />
      <Flex direction={'column'} gap={4} pt={'55px'}>
        <Text fontSize='5xl' color={'rgb(13, 71, 82)'} fontWeight='bold'>
          <Trans i18nKey='home.title'>Vocdoni explorer</Trans>
        </Text>
        <Text>
          <Trans i18nKey='home.subtitle'>
            The most flexible and secure voting protocol to organize any kind of voting process: single-choice,
            multiple-choice, weighted, quadratic voting and much more.
          </Trans>
        </Text>
        <Flex direction={'column'} gap={10}>
          <Stats />
          <FeaturedContent />
        </Flex>
      </Flex>
    </>
  )
}

export default LandingPage
