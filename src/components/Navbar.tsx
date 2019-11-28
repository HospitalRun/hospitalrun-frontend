import React from 'react'
import { useHistory } from 'react-router'
import { Navbar as HospitalRunNavbar } from '@hospitalrun/components'
import { useTranslation } from 'react-i18next'

const Navbar = () => {
  const { t } = useTranslation()
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
      onSearchButtonClick={() => console.log('hello')}
      onSearchTextBoxChange={() => console.log('hello')}
      navLinks={[
        {
          label: t('patients.label'),
          onClick: () => {},
          children: [
            {
              label: t('actions.list'),
              onClick: () => {
                history.push('/patients')
              },
            },
            {
              label: t('actions.new'),
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
