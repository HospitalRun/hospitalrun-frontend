import React from 'react'
import { Route } from 'react-router-dom'

import useAddBreadcrumbs from '../../page-header/breadcrumbs/useAddBreadcrumbs'
import Patient from '../../shared/model/Patient'
import LabsList from './LabsList'

interface LabsProps {
  patient: Patient
}

const Labs = (props: LabsProps) => {
  const { patient } = props

  const breadcrumbs = [
    {
      i18nKey: 'patient.labs.label',
      location: `/patients/${patient.id}/labs`,
    },
  ]
  useAddBreadcrumbs(breadcrumbs)

  return (
    <Route exact path="/patients/:id/labs">
      <LabsList patient={patient} />
    </Route>
  )
}

export default Labs
