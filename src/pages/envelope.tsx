import { VoteInfoResponse } from '@vocdoni/sdk'
import { useLoaderData } from 'react-router-dom'
import EnvelopeDetail from '~components/Envelope/Detail'
import { RoutePath } from '~constants'

const Envelope = () => {
  const envelope = useLoaderData() as VoteInfoResponse
  return <EnvelopeDetail route={RoutePath.Envelope} {...envelope} />
}

export default Envelope
