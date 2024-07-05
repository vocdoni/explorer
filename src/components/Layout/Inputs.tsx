import {
  Button,
  ButtonProps,
  FocusLock,
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
import { ChangeEvent, KeyboardEvent, useState } from 'react'
import { Trans } from 'react-i18next'
import { BiSearchAlt } from 'react-icons/bi'
import { debounce } from '~utils/debounce'

export const PopoverInputSearch = ({ input, button }: { input?: InputSearchProps; button?: ButtonProps }) => {
  return (
    <Popover>
      {({ onClose }) => (
        <>
          <PopoverTrigger>
            <IconButton aria-label='TODO' icon={<BiSearchAlt />} />
          </PopoverTrigger>
          <PopoverContent>
            <PopoverBody>
              <FocusLock>
                <HStack>
                  <InputSearch
                    onKeyUp={(event: KeyboardEvent<HTMLInputElement>) => {
                      if (event.key === 'Enter') {
                        if (button?.onClick) {
                          // Here we are using the button onClick callback which get other kind of event type as argument
                          // Ignore the argument type of the button onclick callback
                          // @ts-ignore
                          button.onClick()
                        }
                      }
                    }}
                    {...input}
                  />
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
              </FocusLock>
            </PopoverBody>
          </PopoverContent>
        </>
      )}
    </Popover>
  )
}

type InputSearchProps = {
  initialValue?: string
  debounceTime?: number
  onChange?: (event: string) => void
} & Omit<InputProps, 'onChange' | 'value'>

export const InputSearch = ({ initialValue, debounceTime = 0, onChange, ...props }: InputSearchProps) => {
  // Inner state to enable initial value
  const [value, setValue] = useState(initialValue ?? '')

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
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          setValue(event.target.value)
          debouncedSearch(event.target.value)
        }}
      />
    </InputGroup>
  )
}
