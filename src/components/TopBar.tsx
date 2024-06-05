import { Button, Menu, MenuButton, Stack } from '@chakra-ui/react'
import { BiChevronDown } from 'react-icons/bi'
import { ColorModeSwitcher } from '~components/ColorModeSwitcher'

export const TopBar = () => {
  return (
    <Stack direction='row' justifySelf='flex-end' alignItems='center' mb={3}>
      <Menu>
        <MenuButton as={Button} rightIcon={<BiChevronDown />}>
          explorer
        </MenuButton>
      </Menu>
      <ColorModeSwitcher />
    </Stack>
  )
}
