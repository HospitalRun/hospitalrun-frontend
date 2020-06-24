import { Spinner, Button } from '@hospitalrun/components'
import format from 'date-fns/format'
import React, { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import SelectWithLabelFormGroup, { Option } from '../components/input/SelectWithLableFormGroup'
import TextInputWithLabelFormGroup from '../components/input/TextInputWithLabelFormGroup'
import useDebounce from '../hooks/debounce'
import Lab from '../model/Lab'
import Permissions from '../model/Permissions'
import { useButtonToolbarSetter } from '../page-header/ButtonBarProvider'
import useTitle from '../page-header/useTitle'
import { RootState } from '../store'
import { searchLabs } from './labs-slice'

type LabFilter = 'requested' | 'completed' | 'canceled' | 'all'

const ViewLabs = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const setButtons = useButtonToolbarSetter()
  useTitle(t('labs.label'))

  const { permissions } = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch()
  const { labs, isLoading } = useSelector((state: RootState) => state.labs)
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

  const loadingIndicator = <Spinner color="blue" loading size={[10, 25]} type="ScaleLoader" />

  const onTableRowClick = (lab: Lab) => {
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

  const listBody = (
    <tbody>
      {labs.map((lab) => (
        <tr onClick={() => onTableRowClick(lab)} key={lab.id}>
          <td>{lab.code}</td>
          <td>{lab.type}</td>
          <td>{lab.requestedOn ? format(new Date(lab.requestedOn), 'yyyy-MM-dd hh:mm a') : ''}</td>
          <td>{lab.status}</td>
        </tr>
      ))}
    </tbody>
  )

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
            label="Search Labs"
            placeholder="Search labs by type"
            value={searchText}
            isEditable
            onChange={onSearchBoxChange}
          />
        </div>
      </div>
      <div className="row">
        <table className="table table-hover">
          <thead className="thead-light">
            <tr>
              <th>{t('labs.lab.code')}</th>
              <th>{t('labs.lab.type')}</th>
              <th>{t('labs.lab.requestedOn')}</th>
              <th>{t('labs.lab.status')}</th>
            </tr>
          </thead>
          {isLoading ? loadingIndicator : listBody}
        </table>
      </div>
    </>
  )
}

export default ViewLabs
