import { Button, Table } from '@hospitalrun/components'
import format from 'date-fns/format'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { useButtonToolbarSetter } from '../../page-header/button-toolbar/ButtonBarProvider'
import useTitle from '../../page-header/title/useTitle'
import SelectWithLabelFormGroup, {
  Option,
} from '../../shared/components/input/SelectWithLableFormGroup'
import { RootState } from '../../shared/store'
import IncidentFilter from '../IncidentFilter'
import { searchIncidents } from '../incidents-slice'

const ViewIncidents = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const dispatch = useDispatch()
  useTitle(t('incidents.reports.label'))
  const [searchFilter, setSearchFilter] = useState(IncidentFilter.reported)
  const { incidents } = useSelector((state: RootState) => state.incidents)

  const setButtonToolBar = useButtonToolbarSetter()
  useEffect(() => {
    setButtonToolBar([
      <Button
        key="newIncidentButton"
        outlined
        color="success"
        icon="add"
        onClick={() => history.push('/incidents/new')}
      >
        {t('incidents.reports.new')}
      </Button>,
    ])

    return () => {
      setButtonToolBar([])
    }
  }, [dispatch, setButtonToolBar, t, history])

  useEffect(() => {
    dispatch(searchIncidents(searchFilter))
  }, [dispatch, searchFilter])

  const filterOptions: Option[] = Object.values(IncidentFilter).map((filter) => ({
    label: t(`incidents.status.${filter}`),
    value: `${filter}`,
  }))

  return (
    <>
      <div className="row">
        <div className="col-md-3 col-lg-2">
          <SelectWithLabelFormGroup
            name="type"
            label={t('incidents.filterTitle')}
            options={filterOptions}
            defaultSelected={filterOptions.filter(({ value }) => value === searchFilter)}
            onChange={(values) => setSearchFilter(values[0] as IncidentFilter)}
            isEditable
          />
        </div>
      </div>
      <div className="row">
        <Table
          tableClassName="table table-hover"
          getID={(row) => row.id}
          data={incidents}
          columns={[
            { label: t('incidents.reports.code'), key: 'code' },
            {
              label: t('incidents.reports.dateOfIncident'),
              key: 'date',
              formatter: (row) =>
                row.date ? format(new Date(row.date), 'yyyy-MM-dd hh:mm a') : '',
            },
            { label: t('incidents.reports.reportedBy'), key: 'reportedBy' },
            { label: t('incidents.reports.reportedOn'), key: 'reportedOn' },
            { label: t('incidents.reports.status'), key: 'status' },
          ]}
          actionsHeaderText={t('actions.label')}
          actions={[
            { label: t('actions.view'), action: (row) => history.push(`incidents/${row.id}`) },
          ]}
        />
      </div>
    </>
  )
}

export default ViewIncidents
