import React from 'react'
import { Route } from 'react-router-dom'

import useAddBreadcrumbs from '../../page-header/breadcrumbs/useAddBreadcrumbs'
import Patient from '../../shared/model/Patient'
import MedicationsList from './MedicationsList'

interface MedicationsProps {
  patient: Patient
}

const Medications = (props: MedicationsProps) => {
  const { patient } = props

  const breadcrumbs = [
    {
      i18nKey: 'patient.medications.label',
      location: `/patients/${patient.id}/medications`,
    },
  ]
  useAddBreadcrumbs(breadcrumbs)

  return (
    <Route exact path="/patients/:id/medications">
      <MedicationsList patient={patient} />
    </Route>
  )
}

export default Medications
