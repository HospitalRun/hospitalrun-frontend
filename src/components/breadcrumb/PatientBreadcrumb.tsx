import React from 'react'
import { useHistory } from 'react-router'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
  Breadcrumb as HrBreadcrumb,
  BreadcrumbItem as HrBreadcrumbItem,
} from '@hospitalrun/components'
import { getPatientFullName } from 'patients/util/patient-name-util'
import { RootState } from '../../store'

const PatientBreacrumb = () => {
  const { t } = useTranslation()
  const { patient } = useSelector((state: RootState) => state.patient)
  const history = useHistory()

  return (
    <HrBreadcrumb>
      <HrBreadcrumbItem onClick={() => history.push('/patients')}>
        {t('patients.label')}
      </HrBreadcrumbItem>
      <HrBreadcrumbItem active>{getPatientFullName(patient)}</HrBreadcrumbItem>
    </HrBreadcrumb>
  )
}

export default PatientBreacrumb
