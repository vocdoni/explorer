import ListPageLayout from '~components/Layout/ListPageLayout'
import { useTranslation } from 'react-i18next'
import { useLoaderData } from 'react-router-dom'
import { IChainValidatorsListResponse } from '@vocdoni/sdk'
import { ValidatorCard } from '~components/Validators/ValidatorCard'

const Validators = () => {
  const validators = (useLoaderData() as IChainValidatorsListResponse).validators

  const { t } = useTranslation()

  const subtitle = validators.length > 0 ? t('validators.validators_count', { count: validators.length }) : ''

  return (
    <ListPageLayout title={t('validators.validators')} subtitle={subtitle}>
      {validators.map((validator, i) => (
        // todo(kon): remove this ignore when https://github.com/vocdoni/vocdoni-sdk/pull/402 is merged
        // @ts-ignore
        <ValidatorCard key={i} {...validator} />
      ))}
    </ListPageLayout>
  )
}

export default Validators
