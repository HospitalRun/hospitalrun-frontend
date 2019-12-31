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
      search={{
        onClickButton: () => {
          console.log('search')
        },
        onChangeInput: () => {
          console.log('change')
        },
        placeholderText: t('actions.search'),
        buttonText: t('actions.search'),
      }}
      navLinks={[
        {
          label: t('patients.label'),
          onClick: () => {
            console.log('patients click')
          },
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
