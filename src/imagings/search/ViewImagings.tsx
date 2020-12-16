import { Button, Container, Row, Column } from '@hospitalrun/components'
import React, { useState, useEffect, useCallback } from 'react'
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
import { RootState } from '../../shared/store'
import ImagingSearchRequest, { ImagingFilter } from '../model/ImagingSearchRequest'
import ImagingRequestTable from './ImagingRequestTable'

const ViewImagings = () => {
  const [searchFilter, setSearchFilter] = useState<ImagingFilter>('all')
  const [searchText, setSearchText] = useState<string>('')
  const debouncedSearchText = useDebounce(searchText, 500)
  const { t } = useTranslator()
  const { permissions } = useSelector((state: RootState) => state.user)
  const history = useHistory()
  const setButtons = useButtonToolbarSetter()
  const updateTitle = useUpdateTitle()
  useEffect(() => {
    updateTitle(t('imagings.label'))
  })

  const filterOptions: Option[] = [
    { label: t('imagings.status.requested'), value: 'requested' },
    { label: t('imagings.status.completed'), value: 'completed' },
    { label: t('imagings.status.canceled'), value: 'canceled' },
    { label: t('imagings.filter.all'), value: 'all' },
  ]

  const [searchRequest, setSearchRequest] = useState<ImagingSearchRequest>({
    status: searchFilter,
    text: debouncedSearchText,
  })

  const getButtons = useCallback(() => {
    const buttons: React.ReactNode[] = []

    if (permissions.includes(Permissions.RequestImaging)) {
      buttons.push(
        <Button
          icon="add"
          onClick={() => history.push('/imaging/new')}
          outlined
          color="success"
          key="imaging.requests.new"
        >
          {t('imagings.requests.new')}
        </Button>,
      )
    }

    return buttons
  }, [permissions, history, t])

  useEffect(() => {
    setSearchRequest(() => ({ text: debouncedSearchText, status: searchFilter }))
  }, [searchFilter, debouncedSearchText])

  useEffect(() => {
    setButtons(getButtons())
    return () => {
      setButtons([])
    }
  }, [getButtons, setButtons])

  const onSearchBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value)
  }

  return (
    <Container>
      <Row>
        <Column md={3} lg={2}>
          <SelectWithLabelFormGroup
            name="type"
            label={t('imagings.filterTitle')}
            options={filterOptions}
            defaultSelected={filterOptions.filter(({ value }) => value === searchFilter)}
            onChange={(values) => setSearchFilter(values[0] as ImagingFilter)}
            isEditable
          />
        </Column>
        <Column>
          <TextInputWithLabelFormGroup
            name="searchbox"
            label={t('imagings.search')}
            placeholder={t('imagings.searchPlaceholder')}
            value={searchText}
            isEditable
            onChange={onSearchBoxChange}
          />
        </Column>
      </Row>
      <Row>
        <ImagingRequestTable searchRequest={searchRequest} />
      </Row>
    </Container>
  )
}

export default ViewImagings
