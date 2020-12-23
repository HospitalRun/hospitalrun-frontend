import { Row, Column, Button, Alert, Toast } from '@hospitalrun/components'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

import useAddBreadcrumbs from '../../page-header/breadcrumbs/useAddBreadcrumbs'
import { useUpdateTitle } from '../../page-header/title/TitleContext'
import SelectWithLabelFormGroup, {
  Option,
} from '../../shared/components/input/SelectWithLabelFormGroup'
import TextFieldWithLabelFormGroup from '../../shared/components/input/TextFieldWithLabelFormGroup'
import TextInputWithLabelFormGroup from '../../shared/components/input/TextInputWithLabelFormGroup'
import useTranslator from '../../shared/hooks/useTranslator'
import { PricingItem } from '../../shared/model/PricingItem'
import useAddPricingItem from '../hooks/useAddPricingItem'
import { formatPrice } from '../utils/formatPrice'
import { PricingItemError } from '../utils/validate-pricingItem'

const AddPricingItem = () => {
  const updateTitle = useUpdateTitle()
  const { t } = useTranslator()
  const history = useHistory()
  const [addPricingItem] = useAddPricingItem()
  const [newPricingItem, setNewPricingItem] = useState({} as PricingItem)
  const [error, setError] = useState<PricingItemError | undefined>(undefined)

  const breadcrumbs = [
    {
      i18nKey: 'billing.requests.new',
      location: '/billing/new',
    },
  ]
  useAddBreadcrumbs(breadcrumbs)

  useEffect(() => {
    updateTitle(t('billing.requests.new'))
  })

  const categoryOptions: Option[] = [
    { label: t('billing.category.imaging'), value: 'imaging' },
    { label: t('billing.category.lab'), value: 'lab' },
    { label: t('billing.category.procedure'), value: 'procedure' },
    { label: t('billing.category.ward'), value: 'ward' },
  ]

  const onFieldChange = (key: string, value: string | number) => {
    setNewPricingItem((pricingItem) => ({
      ...pricingItem,
      [key]: value,
    }))
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
      const createdPricingItem = await addPricingItem(newPricingItem)
      history.push(`/billing/${createdPricingItem?.id}`)
      Toast(
        'success',
        t('states.success'),
        `${t('billing.successfullyCreated')} ${createdPricingItem?.name} as ${
          createdPricingItem?.category
        }`,
      )
    } catch (e) {
      setError(e)
    }
  }

  const onCancel = () => {
    history.push('/billing')
  }

  return (
    <>
      {error && <Alert color="danger" title={t('states.error')} message={t(error.message || '')} />}
      <form>
        <Row>
          <Column>
            <div className="form-group">
              <TextInputWithLabelFormGroup
                name="name"
                label={t('billing.pricingItem.name')}
                isRequired
                isEditable
                value={newPricingItem.name}
                isInvalid={!!error?.itemName}
                feedback={t(error?.itemName)}
                onChange={(e) => onFieldChange('name', e.target.value)}
              />
            </div>
          </Column>
        </Row>
        <Row>
          <Column md={4}>
            <div className="form-group">
              <SelectWithLabelFormGroup
                name="category"
                options={categoryOptions}
                onChange={(values) => onFieldChange('category', values[0])}
                defaultSelected={categoryOptions.filter(
                  (option) => option.value === newPricingItem.category,
                )}
                isRequired
                isEditable
                label={t('billing.pricingItem.category')}
                isInvalid={!!error?.category}
              />
            </div>
          </Column>
          <Column>
            <div className="form-group">
              <TextInputWithLabelFormGroup
                name="type"
                label={t('billing.pricingItem.type')}
                value={newPricingItem.type}
                onChange={(e) => onFieldChange('type', e.target.value)}
                isEditable
              />
            </div>
          </Column>
        </Row>
        <Row>
          <Column md={4}>
            <div className="form-group">
              <TextInputWithLabelFormGroup
                name="price"
                label={t('billing.pricingItem.price')}
                value={formatPrice(newPricingItem.price)}
                onChange={onPriceChange}
                isEditable
                isRequired
                isInvalid={!!error?.price}
                feedback={t(error?.price as string)}
              />
            </div>
          </Column>
          <Column>
            <div className="form-group">
              <TextInputWithLabelFormGroup
                name="expenseTo"
                label={t('billing.pricingItem.expenseTo')}
                value={newPricingItem.expenseTo}
                onChange={(e) => onFieldChange('expenseTo', e.target.value)}
                isEditable
              />
            </div>
          </Column>
        </Row>
        <Row>
          <Column>
            <div className="form-group">
              <TextFieldWithLabelFormGroup
                name="notes"
                label={t('billing.pricingItem.notes')}
                value={newPricingItem.notes}
                onChange={(e) => onFieldChange('notes', e.target.value)}
                isEditable
              />
            </div>
          </Column>
        </Row>
        <div className="row float-right">
          <div className="btn-group btn-group-lg mt-3">
            <Button className="mr-2" color="success" onClick={onSave}>
              {t('actions.save')}
            </Button>
            <Button color="danger" onClick={onCancel}>
              {t('actions.cancel')}
            </Button>
          </div>
        </div>
      </form>
    </>
  )
}

export default AddPricingItem
