import {
  Box,
  Button,
  Flex,
  IconButton,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useBreakpointValue,
} from '@chakra-ui/react'
import '@rainbow-me/rainbowkit/styles.css'
import { useTranslation } from 'react-i18next'
import { VocdoniEnvironment } from '~constants'
import { RxHamburgerMenu } from 'react-icons/rx'

interface HeaderLink {
  name: string
  url: string
  external?: boolean
}

export const TopBar = () => {
  const isSmallScreen = useBreakpointValue({ base: true, md: false })
  const { t } = useTranslation()
  const env = VocdoniEnvironment

  let headerUrl
  switch (env) {
    case 'prod':
      headerUrl = 'images/logo-header.png'
      break
    case 'stg':
      headerUrl = 'images/logo-header-stg.png'
      break
    default:
      headerUrl = 'images/logo-header-dev.png'
      break
  }

  const links: HeaderLink[] = [
    {
      name: t('links.organizations'),
      url: '',
    },
    {
      name: t('links.processes'),
      url: '',
    },
    {
      name: t('links.blocks'),
      url: '',
    },
    {
      name: t('links.transactions'),
      url: '',
    },
    {
      name: t('links.validators'),
      url: '',
    },
    {
      name: t('links.stats'),
      url: '',
    },
    {
      name: t('links.tools'),
      url: '',
    },
  ]

  const rightLinks: HeaderLink[] = [
    {
      name: t('links.verify_vote'),
      url: '',
    },
  ]

  return (
    <Box
      as='header'
      width='100%'
      zIndex='100'
      minHeight='50px'
      position='fixed'
      top='0'
      padding='10px 0'
      backdropFilter='blur(10px)'
      bg='white'
    >
      <Flex justifyContent='space-between' alignItems='start' flexWrap='wrap' px={{ base: 4, md: 8 }}>
        <Flex alignItems='center'>
          <Link href={'/'}>
            <Image src={headerUrl} alt='Vocdoni' marginTop='6px' maxHeight='45px' maxWidth='200px' />
          </Link>

          <Flex display={{ base: 'none', md: 'flex' }} gap={4} marginLeft='20px' wrap={'wrap'}>
            {links.map((link) => (
              <Link key={link.name} href={link.url}>
                {link.name}
              </Link>
            ))}
          </Flex>
        </Flex>

        {isSmallScreen ? (
          <Box pr={2}>
            <Menu>
              <MenuButton as={IconButton} aria-label='Options' icon={<RxHamburgerMenu />} variant='outline' />
              <MenuList>
                {[...links, ...rightLinks].map((link) => (
                  <MenuItem key={link.name}>
                    <Link {...link}>{link.name}</Link>
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </Box>
        ) : (
          <Flex alignItems='center'>
            {rightLinks.map((link, i) => (
              <Button as={'a'} key={i} href={link.url}>
                {link.name}
              </Button>
            ))}
          </Flex>
        )}
      </Flex>
    </Box>
  )
}
