import { IconType } from 'react-icons'
import { BiTransferAlt } from 'react-icons/bi'
import { HiOutlineCube } from 'react-icons/hi2'
import { IoTimeOutline } from 'react-icons/io5'
import { GrValidate } from 'react-icons/gr'

type IconName = 'BlockIcon' | 'TxIcon' | 'ClockIcon' | 'ValidatorIcon'

export const Icons: { [key in IconName]: IconType } = {
  TxIcon: BiTransferAlt,
  BlockIcon: HiOutlineCube,
  ClockIcon: IoTimeOutline,
  ValidatorIcon: GrValidate,
}
