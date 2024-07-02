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
import { generatePath, Link as RouterLink, useLocation } from 'react-router-dom'
import { RoutePath, VocdoniEnvironment } from '~constants'

import { LanguagesMenu } from './Languages'
import logoDevUrl from '/images/logo-header-dev.png'
import logoStgUrl from '/images/logo-header-stg.png'
import logoUrl from '/images/logo-header.png'

interface HeaderLink {
  name: string
  url: string
  external?: boolean
}

export const TopBar = () => {
  const isSmallScreen = useBreakpointValue({ base: true, lg: false })
  const { t } = useTranslation()
  const location = useLocation()
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
      name: t('links.organizations', { defaultValue: 'Organizations' }),
      url: generatePath(RoutePath.OrganizationsList, { page: null, query: null }),
    },
    {
      name: t('links.processes', { defaultValue: 'Processes' }),
      url: generatePath(RoutePath.ProcessesList, { page: null }),
    },
    {
      name: t('links.blocks', { defaultValue: 'Blocks' }),
      url: generatePath(RoutePath.BlocksList, { page: null }),
    },
    {
      name: t('links.transactions', { defaultValue: 'Transactions' }),
      url: generatePath(RoutePath.TransactionsList, { page: null }),
    },
    {
      name: t('links.validators', { defaultValue: 'Validators' }),
      url: generatePath(RoutePath.Validators),
    },
  ]

  const rightLinks: HeaderLink[] = [
    {
      name: t('links.verify_vote', { defaultValue: 'Verify vote' }),
      url: generatePath(RoutePath.Verify, { verifier: null }),
    },
  ]

  const isActive = (link: HeaderLink) => location.pathname === link.url

  return (
    <Box
      as='header'
      w='full'
      zIndex='100'
      minHeight='50px'
      top='0'
      padding='10px 0'
      backdropFilter='blur(10px)'
      bg='white'
      px={{ base: 4, md: 8 }}
    >
      <Flex w='full' gap={5}>
        <Link as={RouterLink} to={'/'}>
          <Image src={headerUrl} alt='Vocdoni' maxW='200px' />
        </Link>

        <Flex gap={4} w='full' display={isSmallScreen ? 'none' : 'flex'}>
          <Flex gap={4} alignItems='center'>
            {links.map((link, i) => (
              <Button variant='link' key={i} as={RouterLink} to={link.url} isActive={isActive(link)}>
                {link.name}
              </Button>
            ))}
          </Flex>
          <Box ml='auto' display='flex'>
            <LanguagesMenu />
            <Flex alignItems='center'>
              {rightLinks.map((link, i) => (
                <Button as={RouterLink} size='sm' key={i} to={link.url}>
                  {link.name}
                </Button>
              ))}
            </Flex>
          </Box>
        </Flex>
        {isSmallScreen && (
          <Box pr={2} ml='auto'>
            <LanguagesMenu />
            <Menu>
              <MenuButton as={IconButton} aria-label='Menu' icon={<RxHamburgerMenu />} variant='outline' />
              <MenuList>
                {[...links, ...rightLinks].map((link) => (
                  <MenuItem key={link.name}>
                    <Button
                      variant='link'
                      justifyContent='start'
                      as={RouterLink}
                      w='full'
                      to={link.url}
                      isActive={isActive(link)}
                    >
                      {link.name}
                    </Button>
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </Box>
        )}
      </Flex>
    </Box>
  )
}
