import { Box, Button, Flex, Image, Text } from '@chakra-ui/react'
import { Trans, useTranslation } from 'react-i18next'

export const FeaturedContent = () => {
  const { t } = useTranslation()

  const icons = [
    {
      width: '96px',
      src: 'images/featured/anonymous.png',
      alt: t('featured.anonymous_image_alt'),
    },
    {
      width: '110px',
      src: 'images/featured/open-source.png',
      alt: t('featured.open_source_image_alt'),
    },
    {
      width: '84px',
      src: 'images/featured/scalable.png',
      alt: t('featured.scalable_image_alt'),
    },

    {
      width: '98px',
      src: 'images/featured/inexpensive.png',
      alt: t('featured.inexpensive_image_alt'),
    },
    {
      width: '70px',
      src: 'images/featured/censorship_subtitle.png',
      alt: t('featured.open_source_image_alt'),
    },
    {
      width: '100px',
      src: 'images/featured/verifiable.png',
      alt: t('featured.verifiable_image_alt'),
    },
  ]

  return (
    <Flex direction={'column'} gap={12}>
      <Flex justify={'space-between'} wrap={'wrap'}>
        {icons.map((icon) => (
          <Image maxW={icon.width} src={icon.src} alt={icon.alt} />
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
          h={'360px'}
        />
        <Flex gap={6} justify={'center'} align={'center'}>
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
            <Button bgColor='accent1' color={'white'}>
              <Trans i18nKey='featured.know_more'>Know more</Trans>
            </Button>
          </Flex>
          <Image width='400px' src='/images/featured/edge-protocol.png' alt={t('featured.edge_protocol_image_alt')} />
        </Flex>
      </Box>
    </Flex>
  )
}
