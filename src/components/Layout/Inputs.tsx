import {
  Button,
  ButtonProps,
  FocusLock,
  FormControl,
  FormErrorMessage,
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
  const [error, setError] = useState<string | null>(null)

  return (
    <Popover>
      {({ onClose }) => {
        const onClick = () => {
          try {
            if (button?.onClick) {
              // Suppressed because by default the ButtonProps.onClick is wants an event argument which is ignored by this CB
              // @ts-ignore
              button.onClick()
            }
            onClose()
          } catch (e: any) {
            setError(e?.message || 'An error occurred')
          }
        }
        return (
          <>
            <PopoverTrigger>
              <IconButton aria-label='TODO' icon={<BiSearchAlt />} />
            </PopoverTrigger>
            <PopoverContent>
              <PopoverBody>
                <FormControl isInvalid={!!error}>
                  <FocusLock>
                    <HStack>
                      <InputSearch
                        onKeyUp={(event: KeyboardEvent<HTMLInputElement>) => {
                          if (event.key === 'Enter') {
                            onClick()
                          }
                        }}
                        {...input}
                      />
                      <Button {...button} onClick={onClick}>
                        <Trans i18nKey={'filter.goto'}>Go to</Trans>
                      </Button>
                    </HStack>
                  </FocusLock>
                  {error && <FormErrorMessage>{error}</FormErrorMessage>}
                </FormControl>
              </PopoverBody>
            </PopoverContent>
          </>
        )
      }}
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
