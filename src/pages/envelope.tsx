import { VoteInfoResponse } from '@vocdoni/sdk'
import { useLoaderData } from 'react-router-dom'
import EnvelopeDetail from '~components/Envelope/Detail'

const Envelope = () => {
  const envelope = useLoaderData() as VoteInfoResponse
  return <EnvelopeDetail {...envelope} />
}

export default Envelope
