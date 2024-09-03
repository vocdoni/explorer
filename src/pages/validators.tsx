import ListPageLayout from '~components/Layout/ListPageLayout'
import { useTranslation } from 'react-i18next'
import { useLoaderData } from 'react-router-dom'
import { IChainValidatorsListResponse } from '@vocdoni/sdk'
import { ValidatorCard } from '~components/Validators/ValidatorCard'
import { PaginatedAsyncList } from '~components/Layout/AsyncList'

const Validators = () => {
  const validators = (useLoaderData() as IChainValidatorsListResponse).validators

  const { t } = useTranslation()

  const subtitle = validators.length > 0 ? t('validators.validators_count', { count: validators.length }) : ''

  return (
    <ListPageLayout title={t('validators.validators')} subtitle={subtitle}>
      <PaginatedAsyncList elements={validators} component={({ element }) => <ValidatorCard {...element} />} />
    </ListPageLayout>
  )
}

export default Validators
