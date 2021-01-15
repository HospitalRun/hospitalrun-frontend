import { Container, Row, Column, Button, Table } from '@hospitalrun/components'
import React, { useEffect, useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { useButtonToolbarSetter } from '../../page-header/button-toolbar/ButtonBarProvider'
import { useUpdateTitle } from '../../page-header/title/TitleContext'
import SelectWithLabelFormGroup, {
  Option,
} from '../../shared/components/input/SelectWithLabelFormGroup'
import TextInputWithLabelFormGroup from '../../shared/components/input/TextInputWithLabelFormGroup'
import useDebounce from '../../shared/hooks/useDebounce'
import useTranslator from '../../shared/hooks/useTranslator'
import Permissions from '../../shared/model/Permissions'
import { PricingItem } from '../../shared/model/PricingItem'
import { RootState } from '../../shared/store'
import usePricingItemsSearch from '../hooks/usePricingItemsSearch'
import { PricingItemCategoryFilter } from '../model/PricingItemSearchRequest'
import { formatPrice } from '../utils/formatPrice'

const ViewPricingItems = () => {
  const updateTitle = useUpdateTitle()
  const setButtons = useButtonToolbarSetter()
  const history = useHistory()
  const { permissions } = useSelector((state: RootState) => state.user)
  const { t } = useTranslator()

  const [searchFilter, setSearchFilter] = useState<PricingItemCategoryFilter>('all')
  const [searchText, setSearchText] = useState('')
  const debouncedSearchText = useDebounce(searchText, 500)
  const { data: pricingItems } = usePricingItemsSearch({
    text: debouncedSearchText,
    category: searchFilter,
  })

  useEffect(() => {
    updateTitle(t('billing.label'))
  })

  const getButtons = useCallback(() => {
    const buttons: React.ReactNode[] = []

    if (permissions.includes(Permissions.AddPricingItems)) {
      buttons.push(
        <Button
          icon="add"
          onClick={() => history.push('/billing/new')}
          outlined
          color="success"
          key="billing.requests.new"
        >
          {t('billing.requests.new')}
        </Button>,
      )
    }

    return buttons
  }, [permissions, history, t])

  useEffect(() => {
    setButtons(getButtons())

    return () => {
      setButtons([])
    }
  }, [setButtons, getButtons])

  const filterOptions: Option[] = [
    { label: t('billing.category.imaging'), value: 'imaging' },
    { label: t('billing.category.lab'), value: 'lab' },
    { label: t('billing.category.procedure'), value: 'procedure' },
    { label: t('billing.category.ward'), value: 'ward' },
    { label: t('billing.category.all'), value: 'all' },
  ]

  const onSearchBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value)
  }

  const onViewClick = (pricingItem: PricingItem) => {
    history.push(`/billing/${pricingItem.id}`)
  }

  return (
    <Container>
      <Row>
        <Column md={3} lg={2}>
          <SelectWithLabelFormGroup
            label={t('billing.filterCategory')}
            name="type"
            options={filterOptions}
            defaultSelected={filterOptions.filter(({ value }) => value === searchFilter)}
            onChange={(values) => setSearchFilter(values[0] as PricingItemCategoryFilter)}
            isEditable
          />
        </Column>
        <Column>
          <TextInputWithLabelFormGroup
            name="searchbox"
            label={t('billing.search')}
            value={searchText}
            onChange={onSearchBoxChange}
            isEditable
          />
        </Column>
      </Row>
      <Row>
        <Table
          getID={(row: PricingItem) => row.id}
          columns={[
            { label: t('billing.pricingItem.category'), key: 'category' },
            { label: t('billing.pricingItem.name'), key: 'name' },
            {
              label: t('billing.pricingItem.price'),
              key: 'price',
              formatter: (row: PricingItem) => formatPrice(row.price),
            },
            { label: t('billing.pricingItem.expenseTo'), key: 'expenseTo' },
          ]}
          actionsHeaderText={t('actions.label')}
          actions={[{ label: t('actions.view'), action: (row) => onViewClick(row as PricingItem) }]}
          data={pricingItems || []}
        />
      </Row>
    </Container>
  )
}

export default ViewPricingItems
