import { Select, Label, Button, Table, Container, Row, Column } from '@hospitalrun/components'
import format from 'date-fns/format'
import React, { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { useButtonToolbarSetter } from '../page-header/button-toolbar/ButtonBarProvider'
import { useUpdateTitle } from '../page-header/title/TitleContext'
import { SelectOption } from '../shared/components/input/SelectOption'
import TextInputWithLabelFormGroup from '../shared/components/input/TextInputWithLabelFormGroup'
import useDebounce from '../shared/hooks/useDebounce'
import useTranslator from '../shared/hooks/useTranslator'
import Lab from '../shared/model/Lab'
import Permissions from '../shared/model/Permissions'
import { RootState } from '../shared/store'
import useLabsSearch from './hooks/useLabsSearch'
import { LabFilter } from './model/LabSearchRequest'

const ViewLabs = () => {
  const { t } = useTranslator()
  const history = useHistory()
  const setButtons = useButtonToolbarSetter()
  const updateTitle = useUpdateTitle()
  useEffect(() => {
    updateTitle(t('labs.label'))
  })
  const { permissions } = useSelector((state: RootState) => state.user)
  const [searchFilter, setSearchFilter] = useState<LabFilter>('all')
  const [searchText, setSearchText] = useState<string>('')
  const debouncedSearchText = useDebounce(searchText, 500)
  const { data: labs } = useLabsSearch({
    text: debouncedSearchText,
    status: searchFilter,
  })

  const getButtons = useCallback(() => {
    const buttons: React.ReactNode[] = []

    if (permissions.includes(Permissions.RequestLab)) {
      buttons.push(
        <Button
          icon="add"
          onClick={() => history.push('/labs/new')}
          outlined
          color="success"
          key="lab.requests.new"
        >
          {t('labs.requests.new')}
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
  }, [getButtons, setButtons])

  const onViewClick = (lab: Lab) => {
    history.push(`/labs/${lab.id}`)
  }

  const onSearchBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value)
  }

  const filterOptions: SelectOption[] = [
    { label: t('labs.status.requested'), value: 'requested' },
    { label: t('labs.status.completed'), value: 'completed' },
    { label: t('labs.status.canceled'), value: 'canceled' },
    { label: t('labs.filter.all'), value: 'all' },
  ]

  return (
    <Container>
      <Row>
        <Column md={3} lg={2}>
          <Label title="type" text={t('labs.filterTitle')} />
          <Select
            id="type"
            options={filterOptions}
            onChange={(values) => setSearchFilter(values[0] as LabFilter)}
            defaultSelected={filterOptions.filter(({ value }) => value === searchFilter)}
            disabled={false}
          />
        </Column>
        <Column>
          <TextInputWithLabelFormGroup
            name="searchbox"
            label={t('labs.search')}
            placeholder={t('labs.search')}
            value={searchText}
            isEditable
            onChange={onSearchBoxChange}
          />
        </Column>
      </Row>
      <Row>
        <Table
          getID={(row) => row.id}
          columns={[
            { label: t('labs.lab.code'), key: 'code' },
            { label: t('labs.lab.type'), key: 'type' },
            {
              label: t('labs.lab.requestedOn'),
              key: 'requestedOn',
              formatter: (row) =>
                row.requestedOn ? format(new Date(row.requestedOn), 'yyyy-MM-dd hh:mm a') : '',
            },
            { label: t('labs.lab.status'), key: 'status' },
          ]}
          data={labs || []}
          actionsHeaderText={t('actions.label')}
          actions={[{ label: t('actions.view'), action: (row) => onViewClick(row as Lab) }]}
        />
      </Row>
    </Container>
  )
}

export default ViewLabs
