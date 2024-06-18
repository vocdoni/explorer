import { Box, Flex, Img, Link } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import logo from '/images/logo-classic.svg'

export const Footer = () => {
  const { i18n } = useTranslation()

  const links = [
    {
      url: 'https://blog.vocdoni.io/',
      name: i18n.t('links.blog'),
      external: true,
    },
    {
      url: 'https://developer.vocdoni.io',
      name: i18n.t('links.docs'),
      external: true,
    },
    {
      url: 'https://discord.gg/sM7UhAGY53',
      name: i18n.t('links.help'),
      external: true,
    },
    {
      // url: ABOUT_PATH,
      url: 'https://vocdoni.io',
      name: i18n.t('links.about'),
      external: false,
    },
    {
      url: 'https://discord.gg/sQCxgYs',
      name: i18n.t('links.support'),
      external: true,
    },
  ]

  return (
    <Flex h={'90px'} mt={'auto'} bottom={0} w={'full'} align={'center'} justify={'space-between'}>
      <Box m={{ base: '20px auto', md: '0 40px' }}>
        <Link as={RouterLink} to={'/'}>
          <Img maxH={'35px'} src={logo} alt='Vocdoni' />
        </Link>
      </Box>
      <Flex gap={4} wrap={'wrap'} mr={6}>
        {links.map((link, i) => (
          <Link key={i} href={link.url} isExternal={link.external}>
            {link.name}
          </Link>
        ))}
      </Flex>
    </Flex>
  )
}
