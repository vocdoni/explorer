import { Box, Grid } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'
import { TopBar } from '~components/TopBar'

const Layout = () => (
  <Box>
    <Grid p={3}>
      <TopBar />
      <Outlet />
    </Grid>
  </Box>
)

export default Layout
