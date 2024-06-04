import { Box, Grid } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'
import { TopBar } from '~components/TopBar'
import { PropsWithChildren } from 'react'

const DefaultLayout = ({ children }: PropsWithChildren) => {
  return (
    <Box
      p={{
        base: '0 15px',
        md: '0 15px',
      }}
      margin='0 auto'
    >
      {children}
    </Box>
  )
}

const Layout = () => (
  <Box minH='100vh' display='flex' flexDirection='column'>
    <Grid p={3}>
      <TopBar />
      <DefaultLayout>
        <Outlet />
      </DefaultLayout>
    </Grid>
  </Box>
)

export default Layout
