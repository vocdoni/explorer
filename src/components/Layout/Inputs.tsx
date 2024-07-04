import {
  Button,
  ButtonProps,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputProps,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from '@chakra-ui/react'
import React, { ChangeEvent } from 'react'
import { BiSearchAlt } from 'react-icons/bi'
import { debounce } from '~utils/debounce'
import { Trans } from 'react-i18next'

export const PopoverInputSearch = ({ input, button }: { input?: InputSearchProps; button?: ButtonProps }) => {
  return (
    <Popover>
      {({ isOpen, onClose }) => (
        <>
          <PopoverTrigger>
            <IconButton aria-label='TODO' icon={<BiSearchAlt />} />
          </PopoverTrigger>
          <PopoverContent>
            <PopoverBody>
              <HStack>
                <InputSearch {...input} />
                <Button
                  {...button}
                  onClick={(e) => {
                    if (button?.onClick) button.onClick(e)
                    onClose()
                  }}
                >
                  <Trans i18nKey={'filter.goto'}>Go to</Trans>
                </Button>
              </HStack>
            </PopoverBody>
          </PopoverContent>
        </>
      )}
    </Popover>
  )
}

type InputSearchProps = {
  debounceTime?: number
  onChange?: (event: string) => void
} & Omit<InputProps, 'onChange'>

export const InputSearch = ({ debounceTime = 0, onChange, ...props }: InputSearchProps) => {
  const debouncedSearch = debounce((value: string) => {
    if (onChange) onChange(value)
  }, debounceTime)

  return (
    <InputGroup>
      <InputLeftElement pointerEvents='none'>
        <BiSearchAlt color={'lightText'} />
      </InputLeftElement>
      <Input
        {...props}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          debouncedSearch(event.target.value)
        }}
      />
    </InputGroup>
  )
}
