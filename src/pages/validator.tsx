import { ensure0x, IChainValidator, IChainValidatorsListResponse } from '@vocdoni/sdk'
import { useLoaderData, useParams } from 'react-router-dom'
import { ValidatorDetail } from '~components/Validators/Detail'

const Validator = () => {
  const validators = (useLoaderData() as IChainValidatorsListResponse).validators as Array<IChainValidator>

  const { address }: { address?: string } = useParams()

  const validator = validators.find(
    (v) => ensure0x(v.validatorAddress.toLowerCase()) === ensure0x(address?.toLowerCase() ?? '')
  )

  if (!address || !validator) throw new Error('Validator not found')

  return <ValidatorDetail validator={validator} />
}

export default Validator
