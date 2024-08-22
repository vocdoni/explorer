import { ElectionStatusBadge as ComponentsStatusBadge } from '@vocdoni/chakra-components'
import { ElectionStatus } from '@vocdoni/sdk'

export const ElectionStatusBadge = ({ status }: { status: ElectionStatus }) => {
  switch (status) {
    case ElectionStatus.ONGOING:
      return <ComponentsStatusBadge bg={'#f3fccc'} color={'#74af07'} variant={'vocdoni'} />
    case ElectionStatus.RESULTS:
    case ElectionStatus.ENDED:
      return <ComponentsStatusBadge bg={'#fff3d6'} color={'#db7d24'} variant={'vocdoni'} />
    case ElectionStatus.UPCOMING:
      return <ComponentsStatusBadge bg={'#d1fdfa'} color={'#1588b9'} variant={'vocdoni'} />
    case ElectionStatus.PAUSED:
    case ElectionStatus.CANCELED:
      return <ComponentsStatusBadge bg={'#fee4d6'} color={'#d62736'} variant={'vocdoni'} />
    default:
      return <></>
  }
}
