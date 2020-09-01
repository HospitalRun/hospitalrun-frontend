import { Button, Table } from '@hospitalrun/components'
import format from 'date-fns/format'
import React, { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { useButtonToolbarSetter } from '../page-header/button-toolbar/ButtonBarProvider'
import useTitle from '../page-header/title/useTitle'
import SelectWithLabelFormGroup, {
  Option,
} from '../shared/components/input/SelectWithLableFormGroup'
import TextInputWithLabelFormGroup from '../shared/components/input/TextInputWithLabelFormGroup'
import useDebounce from '../shared/hooks/useDebounce'
import useTranslator from '../shared/hooks/useTranslator'
import Medication from '../shared/model/Medication'
import Permissions from '../shared/model/Permissions'
import { RootState } from '../shared/store'
import { searchMedications } from './medications-slice'

type MedicationFilter = 'draft' | 'completed' | 'canceled' | 'all'

const ViewMedications = () => {
  const { t } = useTranslator()
  const history = useHistory()
  const setButtons = useButtonToolbarSetter()
  useTitle(t('medications.label'))

  const { permissions } = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch()
  const { medications } = useSelector((state: RootState) => state.medications)
  const [searchFilter, setSearchFilter] = useState<MedicationFilter>('all')
  const [searchText, setSearchText] = useState<string>('')
  const debouncedSearchText = useDebounce(searchText, 500)

  const getButtons = useCallback(() => {
    const buttons: React.ReactNode[] = []

    if (permissions.includes(Permissions.RequestMedication)) {
      buttons.push(
        <Button
          icon="add"
          onClick={() => history.push('/medications/new')}
          outlined
          color="success"
          key="medication.requests.new"
        >
          {t('medications.requests.new')}
        </Button>,
      )
    }

    return buttons
  }, [permissions, history, t])

  useEffect(() => {
    dispatch(searchMedications(debouncedSearchText, searchFilter))
  }, [dispatch, debouncedSearchText, searchFilter])

  useEffect(() => {
    setButtons(getButtons())
    return () => {
      setButtons([])
    }
  }, [dispatch, getButtons, setButtons])

  const onViewClick = (medication: Medication) => {
    history.push(`/medications/${medication.id}`)
  }

  const onSearchBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value)
  }

  const filterOptions: Option[] = [
    { label: t('medications.filter.all'), value: 'all' },
    { label: t('medications.status.draft'), value: 'draft' },
    { label: t('medications.status.active'), value: 'active' },
    { label: t('medications.status.onHold'), value: 'on hold' },
    { label: t('medications.status.completed'), value: 'completed' },
    { label: t('medications.status.enteredInError'), value: 'entered in error' },
    { label: t('medications.status.canceled'), value: 'canceled' },
    { label: t('medications.status.unknown'), value: 'unknown' },
  ]

  return (
    <>
      <div className="row">
        <div className="col-md-3 col-lg-2">
          <SelectWithLabelFormGroup
            name="filterStatus"
            label={t('medications.filterTitle')}
            options={filterOptions}
            defaultSelected={filterOptions.filter(({ value }) => value === searchFilter)}
            onChange={(values) => setSearchFilter(values[0] as MedicationFilter)}
            isEditable
          />
        </div>
        <div className="col">
          <TextInputWithLabelFormGroup
            name="searchbox"
            label={t('medications.search')}
            placeholder={t('medications.search')}
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
            { label: t('medications.medication.medication'), key: 'medication' },
            { label: t('medications.medication.priority'), key: 'priority' },
            { label: t('medications.medication.intent'), key: 'intent' },
            {
              label: t('medications.medication.requestedOn'),
              key: 'requestedOn',
              formatter: (row) =>
                row.requestedOn ? format(new Date(row.requestedOn), 'yyyy-MM-dd hh:mm a') : '',
            },
            { label: t('medications.medication.status'), key: 'status' },
          ]}
          data={medications}
          actionsHeaderText={t('actions.label')}
          actions={[{ label: t('actions.view'), action: (row) => onViewClick(row as Medication) }]}
        />
      </div>
    </>
  )
}

export default ViewMedications
