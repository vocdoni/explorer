import { IconType } from 'react-icons'
import { BiTransferAlt } from 'react-icons/bi'
import { FaExternalLinkAlt } from 'react-icons/fa'
import { FiInfo } from 'react-icons/fi'
import { GrValidate } from 'react-icons/gr'
import { HiOutlineCube } from 'react-icons/hi2'
import { IoTimeOutline } from 'react-icons/io5'

type IconName = 'BlockIcon' | 'TxIcon' | 'ClockIcon' | 'ValidatorIcon' | 'ExternalIcon' | 'InfoIcon'

export const Icons: { [key in IconName]: IconType } = {
  TxIcon: BiTransferAlt,
  BlockIcon: HiOutlineCube,
  ClockIcon: IoTimeOutline,
  ValidatorIcon: GrValidate,
  ExternalIcon: FaExternalLinkAlt,
  InfoIcon: FiInfo,
}
