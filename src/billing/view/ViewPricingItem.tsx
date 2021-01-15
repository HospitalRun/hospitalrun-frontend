import { Row, Column, Button, Toast, Alert } from '@hospitalrun/components'
import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'

import useAddBreadcrumbs from '../../page-header/breadcrumbs/useAddBreadcrumbs'
import { useUpdateTitle } from '../../page-header/title/TitleContext'
import SelectWithLabelFormGroup, {
  Option,
} from '../../shared/components/input/SelectWithLabelFormGroup'
import TextFieldWithLabelFormGroup from '../../shared/components/input/TextFieldWithLabelFormGroup'
import TextInputWithLabelFormGroup from '../../shared/components/input/TextInputWithLabelFormGroup'
import useTranslator from '../../shared/hooks/useTranslator'
import { PricingItem } from '../../shared/model/PricingItem'
import usePricingItem from '../hooks/usePricingItem'
import useUpdatePricingItem from '../hooks/useUpdatePricingItem'
import { formatPrice } from '../utils/formatPrice'
import { PricingItemError } from '../utils/validate-pricingItem'

const ViewPricingItem = () => {
  const { id } = useParams()
  const updateTitle = useUpdateTitle()
  const { t } = useTranslator()
  const history = useHistory()

  const { data: pricingItem } = usePricingItem(id)
  const [pricingItemToView, setPricingItemToView] = useState<PricingItem>()
  const [updatePricingItem] = useUpdatePricingItem()
  const [error, setError] = useState<PricingItemError>()

  const breadcrumbs = [
    {
      i18nKey: 'billing.requests.view',
      location: `/billing/${pricingItem?.id}`,
    },
  ]
  useAddBreadcrumbs(breadcrumbs)

  useEffect(() => {
    updateTitle(t('billing.label'))
  })

  useEffect(() => {
    setPricingItemToView(pricingItem)
  }, [pricingItem])

  const categoryOptions: Option[] = [
    { label: t('billing.category.imaging'), value: 'imaging' },
    { label: t('billing.category.lab'), value: 'lab' },
    { label: t('billing.category.procedure'), value: 'procedure' },
    { label: t('billing.category.ward'), value: 'ward' },
  ]

  const onFieldChange = (field: string, value: string | number) => {
    setPricingItemToView(
      (state) =>
        ({
          ...state,
          [field]: value,
        } as PricingItem),
    )
  }

  const onPriceChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    const separator = ','
    const replacer = new RegExp(separator, 'g')
    const price = Number(value.replace(replacer, ''))

    if (!Number.isNaN(price)) {
      onFieldChange('price', price)
    }
  }

  const onSave = async () => {
    try {
      const updatedPricingItem = await updatePricingItem(pricingItemToView)
      history.push(`/billing/${updatedPricingItem?.id}`)
      Toast(
        'success',
        t('states.success'),
        `${t('billing.successfullyUpdated')} ${updatedPricingItem?.name} as ${
          updatedPricingItem?.category
        }`,
      )
      setError(undefined)
    } catch (e) {
      setError(e as PricingItemError)
    }
  }

  if (pricingItemToView) {
    return (
      <>
        {error && (
          <Alert color="danger" title={t('states.error')} message={t(error.message || '')} />
        )}
        <form>
          <Row>
            <Column>
              <TextInputWithLabelFormGroup
                name="name"
                label={t('billing.pricingItem.name')}
                value={pricingItemToView.name}
                isEditable
                isRequired
                isInvalid={!!error?.itemName}
                feedback={t(error?.itemName as string)}
                onChange={(event) => onFieldChange('name', event.target.value)}
              />
            </Column>
          </Row>
          <Row>
            <Column md={4}>
              <SelectWithLabelFormGroup
                name="category"
                label={t('billing.pricingItem.category')}
                options={categoryOptions}
                defaultSelected={categoryOptions.filter(
                  (option) => option.value === pricingItemToView.category,
                )}
                isEditable
                isRequired
                isInvalid={!!error?.category}
                onChange={(values) => onFieldChange('category', values[0])}
              />
            </Column>
            <Column>
              <TextInputWithLabelFormGroup
                name="type"
                label={t('billing.pricingItem.type')}
                value={pricingItemToView.type}
                isEditable
                onChange={(event) => onFieldChange('type', event.target.value)}
              />
            </Column>
          </Row>
          <Row>
            <Column md={4}>
              <TextInputWithLabelFormGroup
                name="price"
                label={t('billing.pricingItem.price')}
                value={formatPrice(pricingItemToView.price)}
                isEditable
                isRequired
                isInvalid={!!error?.price}
                feedback={t(error?.price as string)}
                onChange={onPriceChange}
              />
            </Column>
            <Column>
              <TextInputWithLabelFormGroup
                name="expenseTo"
                label={t('billing.pricingItem.expenseTo')}
                value={pricingItemToView.expenseTo}
                isEditable
                onChange={(event) => onFieldChange('expenseTo', event.target.value)}
              />
            </Column>
          </Row>
          <Row>
            <Column>
              <TextFieldWithLabelFormGroup
                name="notes"
                label={t('billing.pricingItem.notes')}
                value={pricingItemToView.notes}
                isEditable
                onChange={(event) => onFieldChange('notes', event.target.value)}
              />
            </Column>
          </Row>
          <div className="row float-right">
            <div className="btn-group btn-group-lg mt-3">
              <Button className="mr-2" color="success" onClick={onSave}>
                {t('actions.update')}
              </Button>
            </div>
          </div>
        </form>
      </>
    )
  }
  return <h1>Loading...</h1>
}

export default ViewPricingItem
