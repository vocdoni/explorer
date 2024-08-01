import { Box, BoxProps } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'

const WideLayout = (props: BoxProps) => (
  <Box px={{ base: 4, md: 6, xl: 12 }} w={'full'}>
    <Outlet />
  </Box>
)

export default WideLayout
