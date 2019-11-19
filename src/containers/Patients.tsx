import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { RootState } from '../store/store'
import { fetchPatients } from '../slices/patients-slice'

const Patients = () => {
  const dispatch = useDispatch()
  const { patients, isLoading } = useSelector((state: RootState) => state.patients)

  useEffect(() => {
    dispatch(fetchPatients())
  }, [dispatch])

  if (isLoading) {
    return <h3>Loading...</h3>
  }

  const list = (
    <ul>
      {patients.map((p) => (
        <Link to={`/patients/${p.id}`}>
          <li key={p.id}>
            {p.firstName} {p.lastName}
          </li>
        </Link>
      ))}
    </ul>
  )

  return (
    <div>
      <h1>Patients</h1>
      <div className="container">
        <ul>{list}</ul>
      </div>
    </div>
  )
}

export default Patients
