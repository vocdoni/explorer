import { Box, BoxProps, Grid, useColorMode } from '@chakra-ui/react'
import { useEffect } from 'react'
import { Outlet, ScrollRestoration } from 'react-router-dom'
import { Footer } from '~components/Layout/Footer'
import { TopBar } from '~components/Layout/TopBar'

const DefaultLayout = (props: BoxProps) => (
  <Box
    p={{
      base: '0 1rem',
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
    <ForceLightTheme />
    <Grid p={{ base: 0, md: 3 }}>
      <TopBar />
      <DefaultLayout>
        <Outlet />
      </DefaultLayout>
    </Grid>
    <Footer />
  </Box>
)

// We need to force the theme to light to avoid issues switching from the
// composer layout (auto) to the default one (light)
const ForceLightTheme = () => {
  const { setColorMode } = useColorMode()
  useEffect(() => {
    setColorMode('light')
  }, [])

  return null
}

export default Layout
