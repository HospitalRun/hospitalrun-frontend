import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Spinner } from '@hospitalrun/components'
import { RootState } from '../../store'
import { fetchPatients } from '../patients-slice'
import useTitle from '../../util/useTitle'

const Patients = () => {
  const { t } = useTranslation()
  useTitle(t('patients.label'))
  const dispatch = useDispatch()
  const { patients, isLoading } = useSelector((state: RootState) => state.patients)

  useEffect(() => {
    dispatch(fetchPatients())
  }, [dispatch])

  if (isLoading) {
    return <Spinner color="blue" loading size={[10, 25]} type="ScaleLoader" />
  }

  const list = (
    <ul>
      {patients.map((p) => (
        <Link to={`/patients/${p.id}`} key={p.id}>
          <li key={p.id}>{p.name}</li>
        </Link>
      ))}
    </ul>
  )

  return (
    <div>
      <div className="container">
        <ul>{list}</ul>
      </div>
    </div>
  )
}

export default Patients
