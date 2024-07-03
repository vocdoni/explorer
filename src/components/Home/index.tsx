import { Box, Flex, Text } from '@chakra-ui/react'
import { Trans, useTranslation } from 'react-i18next'
import { FeaturedContent } from '~components/Home/FeaturedContent'
import Stats from '~components/Stats'

const LandingPage = () => {
  // Don't ask why, but for unknown reasons the <Trans /> component does not work well in this level...
  // As soon as we add some hook call here it works, so only the title has been changed
  const { t } = useTranslation()

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
      <Flex direction={'column'} gap={4} pt={'55px'} overflowWrap='anywhere'>
        <Text fontSize='5xl' color={'rgb(13, 71, 82)'} fontWeight='bold'>
          {t('home.title', { defaultValue: 'Vocdoni explorer' })}
        </Text>
        <Text pr={{ base: 4, sm: 0 }}>
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
