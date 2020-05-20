import { Button } from '@hospitalrun/components'
import format from 'date-fns/format'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import Permissions from '../../model/Permissions'
import { RootState } from '../../store'
import AddCarePlanModal from './AddCarePlanModal'

interface Props {
  patientId: string
}

export const CarePlanTab = (props: Props) => {
  const { t } = useTranslation()

  const { permissions } = useSelector((state: RootState) => state.user)
  const { patient } = useSelector((state: RootState) => state.patient)
  const [showAddCarePlanModal, setShowAddCarePlanModal] = useState(false)
  const { patientId } = props
  console.log(patientId)
  console.log(patient.carePlans)
  return (
    <>
      <div className="row">
        <div className="col-md-12 d-flex justify-content-end">
          {permissions.includes(Permissions.AddCarePlan) && (
            <Button
              outlined
              color="success"
              icon="add"
              iconLocation="left"
              onClick={() => setShowAddCarePlanModal(true)}
            >
              {t('patient.carePlan.new')}
            </Button>
          )}
        </div>
      </div>
      <br />
      <table className="table table-hover">
        <thead className="thead-light ">
          <tr>
            <th>{t('patient.carePlan.title')}</th>
            <th>{t('patient.carePlan.startDate')}</th>
            <th>{t('patient.carePlan.endDate')}</th>
            <th>{t('patient.carePlan.status')}</th>
          </tr>
        </thead>
        <tbody>
          {patient.carePlans?.map((carePlan) => (
            <tr key={carePlan.id}>
              <td>{carePlan.title}</td>
              <td>{format(new Date(carePlan.startDate), 'yyyy-MM-dd')}</td>
              <td>{format(new Date(carePlan.endDate), 'yyyy-MM-dd')}</td>
              <td>{carePlan.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <AddCarePlanModal
        show={showAddCarePlanModal}
        onCloseButtonClick={() => setShowAddCarePlanModal(false)}
      />
    </>
  )
}

export default CarePlanTab
