import React, { useState } from 'react'
import { Toast } from '@hospitalrun/components'
import { createPatient } from '../slices/patients-slice'
import { useDispatch } from 'react-redux'
import { withRouter, useHistory } from 'react-router-dom'

import { useTranslation } from 'react-i18next'
import PatientForm from '../components/PatientForm'
import Patient from '../model/Patient'
import useTitle from '../util/useTitle'

const NewPatient = () => {
  const { t } = useTranslation()
  useTitle(t('patients.newPatient'))

  const dispatch = useDispatch()
  const history = useHistory()
  const [patient, setPatient] = useState({ firstName: '', lastName: '' })

  //Abstract Patient into Person with different types
  //Patient, Doctor, etc
  const dispatchCreatePatient = async (patient: Patient, history: any): Promise<any> => {
    dispatch(createPatient(patient as Patient, history))
  }

  const onSaveButtonClick = (): void => {
    dispatchCreatePatient(patient as Patient, history).then(()=>{
      onSaveSuccess()
    }).catch(()=>{
      onSaveError()
    })
  }
  const onSaveSuccess = (): void => {
    Toast('success', 'Patient created succesfully!', 'Success')
  }
  const onSaveError = (): void => {
    Toast('danger', 'There was a problem, please try again.', 'Error')
  }

  const onCancelButtonClick = (): void => {
    history.push(`/patients`)
  }

  const onFieldChange = (key: string, value: string) => {
    setPatient({
      ...patient,
      [key]: value,
    })
  }

  return (
    <div>
      <div className="container">
        <PatientForm
          onFieldChange={onFieldChange}
          onSaveButtonClick={onSaveButtonClick}
          onCancelButtonClick={onCancelButtonClick}
        />
      </div>
    </div>
  )
}

export default withRouter(NewPatient)
