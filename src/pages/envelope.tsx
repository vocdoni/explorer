import { useLoaderData } from 'react-router-dom'
import { IVoteInfoResponse } from '@vocdoni/sdk'
import EnvelopeDetail from '~components/Envelope/Detail'

const Envelope = () => {
  const envelope = useLoaderData() as IVoteInfoResponse
  return <EnvelopeDetail {...envelope} />
}

export default Envelope
