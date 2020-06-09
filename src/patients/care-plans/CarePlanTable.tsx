import { Button } from '@hospitalrun/components'
import format from 'date-fns/format'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import CarePlan from '../../model/CarePlan'
import { RootState } from '../../store'

const CarePlanTable = () => {
  const history = useHistory()
  const { t } = useTranslation()
  const { patient } = useSelector((state: RootState) => state.patient)

  const onViewClick = (carePlan: CarePlan) => {
    history.push(`/patients/${patient.id}/care-plans/${carePlan.id}`)
  }

  return (
    <table className="table table-hover">
      <thead className="thead-light ">
        <tr>
          <th>{t('patient.carePlan.title')}</th>
          <th>{t('patient.carePlan.startDate')}</th>
          <th>{t('patient.carePlan.endDate')}</th>
          <th>{t('patient.carePlan.status')}</th>
          <th>{t('actions.label')}</th>
        </tr>
      </thead>
      <tbody>
        {patient.carePlans?.map((carePlan) => (
          <tr key={carePlan.id}>
            <td>{carePlan.title}</td>
            <td>{format(new Date(carePlan.startDate), 'yyyy-MM-dd')}</td>
            <td>{format(new Date(carePlan.endDate), 'yyyy-MM-dd')}</td>
            <td>{carePlan.status}</td>
            <td>
              <Button color="secondary" onClick={() => onViewClick(carePlan)}>
                View
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default CarePlanTable
