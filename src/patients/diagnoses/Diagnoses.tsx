import React from 'react'
import Patient from 'model/Patient'
import useAddBreadcrumbs from 'breadcrumbs/useAddBreadcrumbs'

interface Props {
  patient: Patient
}

const Diagnoses = (props: Props) => {
  const { patient } = props
  const breadcrumbs = [
    {
      i18nKey: 'patient.diagnoses.label',
      location: `/patients/${patient.id}/diagnoses`,
    },
  ]
  useAddBreadcrumbs(breadcrumbs)

  return <h1>Diagnoses</h1>
}

export default Diagnoses
