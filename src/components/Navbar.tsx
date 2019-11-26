import React from 'react'
import { useHistory } from 'react-router'
import { Navbar as HospitalRunNavbar } from '@hospitalrun/components'

const Navbar = () => {
  const history = useHistory()
  return (
    <HospitalRunNavbar
      brand={{
        label: 'HospitalRun',
        onClick: () => {
          history.push('/')
        },
      }}
      bg="dark"
      variant="dark"
      onSeachButtonClick={() => console.log('hello')}
      onSearchTextBoxChange={() => console.log('hello')}
      navLinks={[
        {
          label: 'Patients',
          onClick: () => {},
          children: [
            {
              label: 'List',
              onClick: () => {
                history.push('/patients')
              },
            },
            {
              label: 'New',
              onClick: () => {
                history.push('/patients/new')
              },
            },
          ],
        },
      ]}
    />
  )
}

export default Navbar
