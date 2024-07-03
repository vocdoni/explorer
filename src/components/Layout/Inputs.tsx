import { Input, InputGroup, InputLeftElement, InputProps } from '@chakra-ui/react'
import { ChangeEvent } from 'react'
import { BiSearchAlt } from 'react-icons/bi'
import { debounce } from '~utils/debounce'

export const InputSearch = ({
  debounceTime = 0,
  onChange,
  ...props
}: {
  debounceTime?: number
  onChange?: (event: string) => void
} & Omit<InputProps, 'onChange'>) => {
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
