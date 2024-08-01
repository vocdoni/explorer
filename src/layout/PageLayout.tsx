import { Box } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'

const PageLayout = () => (
  <Box
    p={{
      base: '0 1rem',
      md: '0 15px',
    }}
    margin='0 auto'
    maxW={'1152px'}
    w={'full'}
  >
    <Outlet />
  </Box>
)

export default PageLayout
