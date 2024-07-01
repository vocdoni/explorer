import ListPageLayout from '~src/layout/ListPageLayout'
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
        <ValidatorCard key={i} {...validator} />
      ))}
    </ListPageLayout>
  )
}

export default Validators
