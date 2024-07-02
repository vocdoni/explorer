import { Button, Menu, MenuButton, MenuItem, MenuList, MenuProps } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { FaChevronDown, FaChevronUp, FaGlobeAmericas } from 'react-icons/fa'
import languages from '~i18n/languages.mjs'

export const LanguagesList = () => {
  const { i18n } = useTranslation()

  const isAnyLanguageSelected =
    Object.keys(languages).some((l) => l === i18n.language) && languages.includes(i18n.language)

  return (
    <>
      {languages.map((k: string) => (
        <MenuItem
          key={k}
          onClick={() => {
            i18n.changeLanguage(k)
          }}
          display='flex'
          justifyContent='center'
          fontWeight={k === i18n.language ? 'bold' : ''}
          borderRadius='none'
        >
          {k.toUpperCase()}
        </MenuItem>
      ))}
    </>
  )
}

export const LanguagesMenu = (props: Omit<MenuProps, 'children'>) => {
  const { t } = useTranslation()

  return (
    <Menu>
      {({ isOpen }) => (
        <>
          <MenuButton
            as={Button}
            aria-label={t('menu.burger_aria_label')}
            variant='rounded-ghost'
            sx={{ span: { margin: 'px' } }}
            rightIcon={isOpen ? <FaChevronUp /> : <FaChevronDown />}
            minW='none'
            size='sm'
          >
            <FaGlobeAmericas />
          </MenuButton>
          <MenuList minW={16} mt={2}>
            <LanguagesList />
          </MenuList>
        </>
      )}
    </Menu>
  )
}
