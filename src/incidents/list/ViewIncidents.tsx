import format from 'date-fns/format'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import Incident from '../../model/Incident'
import useTitle from '../../page-header/useTitle'
import { RootState } from '../../store'
import { fetchIncidents } from '../incidents-slice'

const ViewIncidents = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const dispatch = useDispatch()
  useTitle(t('incidents.reports.label'))

  const { incidents } = useSelector((state: RootState) => state.incidents)

  useEffect(() => {
    dispatch(fetchIncidents())
  }, [dispatch])

  const onTableRowClick = (incident: Incident) => {
    history.push(`incidents/${incident.id}`)
  }

  return (
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
  )
}

export default ViewIncidents
