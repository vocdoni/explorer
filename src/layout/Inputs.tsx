import { Input, InputGroup, InputLeftElement, InputProps } from '@chakra-ui/react'
import { BiSearchAlt } from 'react-icons/bi'

export const InputSearch = (props: InputProps) => {
  return (
    <InputGroup>
      <InputLeftElement pointerEvents='none'>
        <BiSearchAlt color={'lightText'} />
      </InputLeftElement>
      <Input {...props} />
    </InputGroup>
  )
}
