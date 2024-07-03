import { Box, Button, Flex, Image, Link, Text } from '@chakra-ui/react'
import { Trans, useTranslation } from 'react-i18next'

import anonymous from '/images/featured/anonymous.png'
import open from '/images/featured/open-source.png'
import scalable from '/images/featured/scalable.png'
import inexpensive from '/images/featured/inexpensive.png'
import censorship from '/images/featured/censorship_subtitle.png'
import verifiable from '/images/featured/verifiable.png'
import edge from '/images/featured/edge-protocol.png'

export const FeaturedContent = () => {
  const { t } = useTranslation()

  const icons = [
    {
      width: '96px',
      src: anonymous,
      alt: t('featured.anonymous_image_alt'),
    },
    {
      width: '110px',
      src: open,
      alt: t('featured.open_source_image_alt'),
    },
    {
      width: '84px',
      src: scalable,
      alt: t('featured.scalable_image_alt'),
    },

    {
      width: '98px',
      src: inexpensive,
      alt: t('featured.inexpensive_image_alt'),
    },
    {
      width: '70px',
      src: censorship,
      alt: t('featured.open_source_image_alt'),
    },
    {
      width: '100px',
      src: verifiable,
      alt: t('featured.verifiable_image_alt'),
    },
  ]

  return (
    <Flex direction={'column'} gap={12}>
      <Flex justify={'space-between'} wrap={'wrap'}>
        {icons.map((icon, i) => (
          <Image key={i} maxW={icon.width} src={icon.src} alt={icon.alt} />
        ))}
      </Flex>
      <Box>
        <Box
          w={'full'}
          sx={{
            background: 'linear-gradient(101.89deg, #F1FFDF 17.32%, #E1FFFF 68.46%);',
          }}
          position='absolute'
          left={0}
          zIndex={-1}
          h={{ base: '690px', sm: '660px', md: '360px' }}
        />
        <Flex
          direction={{ base: 'column', md: 'row' }}
          gap={6}
          justify={'center'}
          align={'center'}
          pt={{ base: 8, md: 0 }}
        >
          <Flex direction={'column'} gap={6}>
            <Text fontSize={'3xl'}>
              <Trans i18nKey={'featured.a_cutting_edge_voting_protocol'}>A cutting edge voting protocol</Trans>
            </Text>
            <Text fontSize={'md'} lineHeight={10}>
              <Trans i18nKey={'featured.leveraging'}>
                A fully anonymous voting system ensuring data availability
                <br />
                Leveraging on decentralized technologies
              </Trans>
            </Text>
            <Button as={Link} bgColor='accent1' color={'white'} href={'https://app-dev.vocdoni.io/'}>
              <Trans i18nKey='featured.know_more'>Know more</Trans>
            </Button>
          </Flex>
          <Image width='400px' src={edge} alt={t('featured.edge_protocol_image_alt')} />
        </Flex>
      </Box>
    </Flex>
  )
}
