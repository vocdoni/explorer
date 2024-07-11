import { Box, Code } from '@chakra-ui/react'
import { OrganizationProvider } from '@vocdoni/react-providers'
import { AdminTx, ensure0x, NewProcessTx, SetProcessTx, TransactionType, Tx, VoteEnvelope } from '@vocdoni/sdk'
import { TFunction } from 'i18next/index'
import { useTranslation } from 'react-i18next'
import { generatePath } from 'react-router-dom'
import { ReducedTextAndCopy } from '~components/Layout/CopyButton'
import { DetailsGrid, GridItemProps } from '~components/Layout/DetailsGrid'
import { SmallOrganizationCard } from '~components/Organizations/Card'
import { RoutePath } from '~constants'
import { b64ToHex } from '~utils/objects'

const processIdGridItem = (processId: string, t: TFunction): GridItemProps => {
  return {
    label: t('transactions.belongs_to_process', { defaultValue: 'Belongs to process' }),
    children: (
      <ReducedTextAndCopy
        breakPoint={{ base: true, lg: false }}
        pl={0}
        color={'textAccent1'}
        toCopy={processId}
        fontWeight={'normal'}
        h={0}
        fontSize={'md'}
        to={generatePath(RoutePath.Process, { pid: processId })}
      >
        {processId}
      </ReducedTextAndCopy>
    ),
  }
}

const organizationIdGridItem = (orgId: string, t: TFunction): GridItemProps => {
  const _orgId = ensure0x(orgId)
  return {
    label: t('transactions.belong_to_organization', { defaultValue: 'Belongs to organization' }),
    children: (
      <OrganizationProvider id={_orgId}>
        {/*This box is fixing the alignment with the grid label*/}
        <Box display={'flex'} alignItems={'last baseline'}>
          <SmallOrganizationCard id={_orgId} avatar={{ w: '20px', minW: '20px' }} />
        </Box>
      </OrganizationProvider>
    ),
  }
}

const VoteTxDetails = ({ rawTx, votePackage, processId }: { rawTx: any } & VoteEnvelope) => {
  const { t } = useTranslation()
  if (votePackage) {
    // Decode the vote package from base64
    votePackage = atob(votePackage)
    // And copy it alsow to rawTx
    rawTx['tx']['vote']['votePackage'] = JSON.parse(votePackage)
  }
  const process = ensure0x(b64ToHex(processId))

  const details: GridItemProps[] = [
    { ...processIdGridItem(process, t) },
    ...(votePackage
      ? [
          {
            label: t('transactions.vote_package', { defaultValue: 'Vote package' }),
            children: <Code>{votePackage}</Code>,
          },
        ]
      : []),
  ]
  return <DetailsGrid details={details} />
}

const NewProcessTxDetails = ({ process }: NewProcessTx) => {
  const { t } = useTranslation()
  if (process) {
    const details = [{ ...organizationIdGridItem(b64ToHex(process.entityId as unknown as string), t) }]
    return <DetailsGrid details={details} />
  }
  return null
}

const AdminTxDetails = ({ processId }: AdminTx) => {
  const { t } = useTranslation()
  const details = [{ ...processIdGridItem(b64ToHex(processId as unknown as string), t) }]
  return <DetailsGrid details={details} />
}

const SetProcessTxDetails = ({ processId, results }: SetProcessTx) => {
  const { t } = useTranslation()
  const details = [{ ...processIdGridItem(b64ToHex(processId as unknown as string), t) }]
  if (results) {
    const orgId = b64ToHex(results.entityId as unknown as string)
    details.push({ ...organizationIdGridItem(orgId, t) })
  }
  return <DetailsGrid details={details} />
}

export const SpecificTxDetails = ({ rawTx, tx }: { tx: Tx; rawTx: any }) => {
  if (!tx.tx) return
  const txPayload = tx.tx as any

  const txType = Object.keys(tx.tx)[0] as TransactionType
  switch (txType) {
    case 'vote':
      return <VoteTxDetails rawTx={rawTx} {...(txPayload.vote as VoteEnvelope)} />
    case 'newProcess':
      return <NewProcessTxDetails {...(txPayload.newProcess as NewProcessTx)} />
    case 'admin':
      return <AdminTxDetails {...(txPayload.admin as AdminTx)} />
    case 'setProcess':
      return <SetProcessTxDetails {...(txPayload.setProcess as SetProcessTx)} />
  }
}
