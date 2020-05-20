import format from 'date-fns/format'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import SelectWithLabelFormGroup from '../../components/input/SelectWithLableFormGroup'
import Incident from '../../model/Incident'
import useTitle from '../../page-header/useTitle'
import { RootState } from '../../store'
import IncidentFilter from '../IncidentFilter'
import { searchIncidents } from '../incidents-slice'

const ViewIncidents = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const dispatch = useDispatch()
  useTitle(t('incidents.reports.label'))
  const [searchFilter, setSearchFilter] = useState(IncidentFilter.reported)
  const { incidents } = useSelector((state: RootState) => state.incidents)

  useEffect(() => {
    dispatch(searchIncidents(searchFilter))
  }, [dispatch, searchFilter])

  const onTableRowClick = (incident: Incident) => {
    history.push(`incidents/${incident.id}`)
  }

  const onFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchFilter(event.target.value as IncidentFilter)
  }

  const filterOptions = Object.values(IncidentFilter).map((filter) => ({
    label: t(`incidents.status.${filter}`),
    value: `${filter}`,
  }))

  return (
    <>
      <div className="row">
        <div className="col-md-3 col-lg-2">
          <SelectWithLabelFormGroup
            name="type"
            value={searchFilter}
            label={t('incidents.filterTitle')}
            isEditable
            options={filterOptions}
            onChange={onFilterChange}
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
                <td>{format(new Date(incident.date), 'yyyy-MM-dd hh:mm a')}</td>
                <td>{incident.reportedBy}</td>
                <td>{format(new Date(incident.reportedOn), 'yyyy-MM-dd hh:mm a')}</td>
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
