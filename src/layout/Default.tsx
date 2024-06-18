import { Box, BoxProps, Grid } from '@chakra-ui/react'
import { Outlet, ScrollRestoration } from 'react-router-dom'
import { Footer } from '~components/Footer'
import { TopBar } from '~components/TopBar'

const DefaultLayout = (props: BoxProps) => (
  <Box
    p={{
      base: '0 15px',
      md: '0 15px',
    }}
    margin='0 auto'
    maxW={'1152px'}
    w='100%'
    {...props}
  />
)

const Layout = () => (
  <Box minH='100vh' display='flex' flexDirection='column'>
    <ScrollRestoration />
    <Grid p={3}>
      <TopBar />
      <DefaultLayout>
        <Outlet />
      </DefaultLayout>
    </Grid>
    <Footer />
  </Box>
)

export default Layout
