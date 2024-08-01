import { Box, BoxProps } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'

const WideLayout = (props: BoxProps) => (
  <Box px={{ base: 4, md: 6, xl: 12 }} w={'full'} maxW={'1800px'} margin='0 auto'>
    <Outlet />
  </Box>
)

export default WideLayout
