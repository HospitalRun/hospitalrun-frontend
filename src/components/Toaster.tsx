import React from 'react'
import { Toaster as HospitalRunToaster } from '@hospitalrun/components'
import './/'
const Toaster = () => {
  return (
    <HospitalRunToaster autoClose={3000} hideProgressBar draggable />
  )
}

export default Toaster
