import React, { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import useTitle from 'page-header/useTitle'
import { useTranslation } from 'react-i18next'
import format from 'date-fns/format'
import { useButtonToolbarSetter } from 'page-header/ButtonBarProvider'
import { Spinner, Button } from '@hospitalrun/components'
import { useHistory } from 'react-router'
import Lab from 'model/Lab'
import Permissions from 'model/Permissions'
import SelectWithLabelFormGroup from 'components/input/SelectWithLableFormGroup'
import TextInputWithLabelFormGroup from 'components/input/TextInputWithLabelFormGroup'
import { RootState } from '../store'
import { searchLabs } from './labs-slice'
import useDebounce from '../hooks/debounce'

type filter = 'requested' | 'completed' | 'canceled' | 'all'

const ViewLabs = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const setButtons = useButtonToolbarSetter()
  useTitle(t('labs.label'))

  const { permissions } = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch()
  const { labs, isLoading } = useSelector((state: RootState) => state.labs)
  const [searchFilter, setSearchFilter] = useState<filter>('all')
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

  const setFilter = (filter: string) =>
    filter === 'requested'
      ? 'requested'
      : filter === 'completed'
      ? 'completed'
      : filter === 'canceled'
      ? 'canceled'
      : 'all'

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

  const onSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchFilter(setFilter(event.target.value))
  }

  const onSearchBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value)
  }

  const listBody = (
    <tbody>
      {labs.map((lab) => (
        <tr onClick={() => onTableRowClick(lab)} key={lab.id}>
          <td>{lab.code}</td>
          <td>{lab.type}</td>
          <td>{format(new Date(lab.requestedOn), 'yyyy-MM-dd hh:mm a')}</td>
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
            value={searchFilter}
            label={t('labs.filterTitle')}
            isEditable
            options={[
              { label: t('labs.status.requested'), value: 'requested' },
              { label: t('labs.status.completed'), value: 'completed' },
              { label: t('labs.status.canceled'), value: 'canceled' },
              { label: t('labs.filter.all'), value: 'all' },
            ]}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
              onSelectChange(event)
            }}
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
