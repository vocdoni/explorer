import { IChainBlockInfoResponse } from '@vocdoni/sdk'
import { useLoaderData } from 'react-router-dom'
import { BlockDetail as BlockDetailView } from '~components/Blocks/Detail'

const BlockDetail = () => {
  const block = useLoaderData() as IChainBlockInfoResponse
  return <BlockDetailView block={block} />
}

export default BlockDetail
