import { Button } from '@hospitalrun/components'
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
import Incident from '../../shared/model/Incident'
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

  const onTableRowClick = (incident: Incident) => {
    history.push(`incidents/${incident.id}`)
  }

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
        <table className="table table-hover">
          <thead className="thead-light">
            <tr>
              <th>{t('incidents.reports.code')}</th>
              <th>{t('incidents.reports.dateOfIncident')}</th>
              <th>{t('incidents.reports.reportedBy')}</th>
              <th>{t('incidents.reports.reportedOn')}</th>
              <th>{t('incidents.reports.status')}</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((incident: Incident) => (
              <tr onClick={() => onTableRowClick(incident)} key={incident.id}>
                <td>{incident.code}</td>
                <td>
                  {incident.date ? format(new Date(incident.date), 'yyyy-MM-dd hh:mm a') : ''}
                </td>
                <td>{incident.reportedBy}</td>
                <td>
                  {incident.reportedOn
                    ? format(new Date(incident.reportedOn), 'yyyy-MM-dd hh:mm a')
                    : ''}
                </td>
                <td>{incident.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default ViewIncidents
