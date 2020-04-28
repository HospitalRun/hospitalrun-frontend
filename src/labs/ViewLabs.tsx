import React, { useState, useEffect } from 'react'
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
import { fetchLabs, searchLabs, setFilter } from './labs-slice'
import useDebounce from '../hooks/debounce'

const ViewLabs = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const setButtons = useButtonToolbarSetter()
  useTitle(t('labs.label'))

  const { permissions } = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch()
  const { labs, isLoading, statusFilter } = useSelector((state: RootState) => state.labs)
  const [searchText, setSearchText] = useState<string>('')

  const debouncedSearchText = useDebounce(searchText, 500)

  const getButtons = () => {
    const buttons: React.ReactNode[] = []

    if (permissions.includes(Permissions.RequestLab)) {
      buttons.push(
        <Button icon="add" onClick={() => history.push('/labs/new')} outlined color="success">
          {t('labs.requests.new')}
        </Button>,
      )
    }

    return buttons
  }

  setButtons(getButtons())

  useEffect(() => {
    dispatch(searchLabs(debouncedSearchText))
  }, [dispatch, debouncedSearchText])

  useEffect(() => {
    dispatch(fetchLabs())
  }, [dispatch])

  const loadingIndicator = <Spinner color="blue" loading size={[10, 25]} type="ScaleLoader" />

  const onTableRowClick = (lab: Lab) => {
    history.push(`/labs/${lab.id}`)
  }

  const onSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setFilter(event.target.value))
    dispatch(searchLabs(debouncedSearchText))
  }

  const onSearchBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value)
  }

  const listBody = (
    <tbody>
      {labs.map((lab) => (
        <tr onClick={() => onTableRowClick(lab)} key={lab.id}>
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
            value={statusFilter}
            label={t('labs.filter_title')}
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
            label="_"
            placeholder="Search labs"
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
