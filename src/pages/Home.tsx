import LandingPage from '~components/Home'
import { useLoaderData } from 'react-router-dom'
import { IChainGetInfoResponse } from '@vocdoni/sdk'
import { useChainInfo } from '~queries/stats'

const Home = () => {
  const chainInfo = useLoaderData() as IChainGetInfoResponse
  const {} = useChainInfo({
    initialData: chainInfo,
  })
  return <LandingPage />
}

export default Home
