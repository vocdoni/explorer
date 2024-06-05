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
import { useTranslation } from 'react-i18next'
import { RxHamburgerMenu } from 'react-icons/rx'
import { generatePath } from 'react-router-dom'
import { VocdoniEnvironment } from '~constants'
import { ORGANIZATIONS_LIST_PATH } from '~src/router'

import logoUrl from '/images/logo-header.png'
import logoStgUrl from '/images/logo-header-stg.png'
import logoDevUrl from '/images/logo-header-dev.png'

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
      headerUrl = logoUrl
      break
    case 'stg':
      headerUrl = logoStgUrl
      break
    default:
      headerUrl = logoDevUrl
      break
  }

  const links: HeaderLink[] = [
    {
      name: t('links.organizations'),
      url: generatePath(ORGANIZATIONS_LIST_PATH, { page: null, query: null }),
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
