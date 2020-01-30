import React, { useState } from 'react'
import { Toast, Toaster } from '@hospitalrun/components'
import { withRouter, useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PatientForm from '../components/PatientForm'
import useTitle from '../util/useTitle'

const NewPatient = () => {
  const { t } = useTranslation()
  useTitle(t('patients.newPatient'))
  // const dispatch = useDispatch()
  const history = useHistory()
  const [patient, setPatient] = useState({ firstName: '', lastName: '' })
  Toast('success', 'This is a toaster!', 'Success')

  const onSaveButtonClick = async () => {
    // dispatch(createPatient(patient as Patient, history))
    console.log(history)
  }

  const onCancelButtonClick = () => {
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
        <Toaster autoClose={3000} hideProgressBar draggable />
      </div>
    </div>
  )
}

export default withRouter(NewPatient)
