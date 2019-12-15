import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { withRouter, useParams } from 'react-router-dom'
import { Spinner } from '@hospitalrun/components'
import { useTranslation } from 'react-i18next'
import useTitle from '../util/useTitle'
import { fetchPatient } from '../slices/patient-slice'
import { RootState } from '../store'

const ViewPatient = () => {
  const { t } = useTranslation()
  useTitle(t('patients.viewPatient'))
  const dispatch = useDispatch()
  const { patient, isLoading } = useSelector((state: RootState) => state.patient)
  const { id } = useParams()

  useEffect(() => {
    if (id) {
      dispatch(fetchPatient(id))
    }
  }, [dispatch, id])

  if (isLoading) {
    return <Spinner color="blue" loading size={[10, 25]} type="ScaleLoader" />
  }

  return (
    <div className="container">
      {patient.id}
      <h1>{`${patient.name}`}</h1>
    </div>
  )
}

export default withRouter(ViewPatient)
