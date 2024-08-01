import { Box, Grid } from '@chakra-ui/react'
import { Outlet, ScrollRestoration } from 'react-router-dom'
import { Footer } from '~components/Layout/Footer'
import { TopBar } from '~components/Layout/TopBar'

const Layout = () => (
  <Box minH='100vh' display='flex' flexDirection='column'>
    <ScrollRestoration />
    <Grid p={{ base: 0, md: 3 }}>
      <TopBar />
      <Outlet />
    </Grid>
    <Footer />
  </Box>
)

export default Layout
