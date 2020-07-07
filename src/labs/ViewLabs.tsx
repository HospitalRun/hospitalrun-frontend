import { Button, Table } from '@hospitalrun/components'
import format from 'date-fns/format'
import React, { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { useButtonToolbarSetter } from '../page-header/button-toolbar/ButtonBarProvider'
import useTitle from '../page-header/title/useTitle'
import SelectWithLabelFormGroup, {
  Option,
} from '../shared/components/input/SelectWithLableFormGroup'
import TextInputWithLabelFormGroup from '../shared/components/input/TextInputWithLabelFormGroup'
import useDebounce from '../shared/hooks/useDebounce'
import Lab from '../shared/model/Lab'
import Permissions from '../shared/model/Permissions'
import { RootState } from '../shared/store'
import { searchLabs } from './labs-slice'

type LabFilter = 'requested' | 'completed' | 'canceled' | 'all'

const ViewLabs = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const setButtons = useButtonToolbarSetter()
  useTitle(t('labs.label'))

  const { permissions } = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch()
  const { labs } = useSelector((state: RootState) => state.labs)
  const [searchFilter, setSearchFilter] = useState<LabFilter>('all')
  const [searchText, setSearchText] = useState<string>('')
  const debouncedSearchText = useDebounce(searchText, 500)

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
    dispatch(searchLabs(debouncedSearchText, searchFilter))
  }, [dispatch, debouncedSearchText, searchFilter])

  useEffect(() => {
    setButtons(getButtons())
    return () => {
      setButtons([])
    }
  }, [dispatch, getButtons, setButtons])

  const onViewClick = (lab: Lab) => {
    history.push(`/labs/${lab.id}`)
  }

  const onSearchBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value)
  }

  const filterOptions: Option[] = [
    { label: t('labs.status.requested'), value: 'requested' },
    { label: t('labs.status.completed'), value: 'completed' },
    { label: t('labs.status.canceled'), value: 'canceled' },
    { label: t('labs.filter.all'), value: 'all' },
  ]

  return (
    <>
      <div className="row">
        <div className="col-md-3 col-lg-2">
          <SelectWithLabelFormGroup
            name="type"
            label={t('labs.filterTitle')}
            options={filterOptions}
            defaultSelected={filterOptions.filter(({ value }) => value === searchFilter)}
            onChange={(values) => setSearchFilter(values[0] as LabFilter)}
            isEditable
          />
        </div>
        <div className="col">
          <TextInputWithLabelFormGroup
            name="searchbox"
            label={t('labs.search')}
            placeholder={t('labs.search')}
            value={searchText}
            isEditable
            onChange={onSearchBoxChange}
          />
        </div>
      </div>
      <div className="row">
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
          data={labs}
          actionsHeaderText={t('actions.label')}
          actions={[{ label: t('actions.view'), action: (row) => onViewClick(row as Lab) }]}
        />
      </div>
    </>
  )
}

export default ViewLabs
