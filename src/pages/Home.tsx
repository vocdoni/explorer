import { IChainGetInfoResponse } from '@vocdoni/sdk'
import { useLoaderData } from 'react-router-dom'
import LandingPage from '~components/Home'
import { useChainInfo } from '~queries/stats'

const Home = () => {
  const chainInfo = useLoaderData() as IChainGetInfoResponse
  const {} = useChainInfo({
    initialData: chainInfo,
  })
  return <LandingPage />
}

export default Home
