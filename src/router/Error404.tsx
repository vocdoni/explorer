import { Alert, AlertIcon } from '@chakra-ui/react'

const Error404 = () => (
  <Alert status='warning'>
    <AlertIcon />
    Looks like the content you were accessing could not not be found.
  </Alert>
)

export default Error404
