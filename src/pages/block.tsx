import { BlockDetail as BlockDetailView } from '~components/Blocks/Detail'
import { useLoaderData } from 'react-router-dom'
import { IChainBlockInfoResponse } from '@vocdoni/sdk'

const BlockDetail = () => {
  const block = useLoaderData() as IChainBlockInfoResponse
  return <BlockDetailView block={block} />
}

export default BlockDetail
