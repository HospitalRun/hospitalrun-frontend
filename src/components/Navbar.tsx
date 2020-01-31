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
      search={{
        buttonText: 'actions.search',
        placeholderText: 'actions.search',
        onClickButton: () => undefined,
        onChangeInput: () => undefined,
      }}
      navLinks={[
        {
          label: t('patients.label', 'patients'),
          onClick: () => undefined,
          children: [
            {
              label: t('actions.list', 'list'),
              onClick: () => {
                history.push('/patients')
              },
            },
            {
              label: t('actions.new', 'new'),
              onClick: () => {
                history.push('/patients/new')
              },
            },
          ],
        },
        {
          label: t('scheduling.label'),
          onClick: () => undefined,
          children: [
            {
              label: t('scheduling.appointments.label'),
              onClick: () => {
                history.push('/appointments')
              },
            },
            {
              label: t('scheduling.appointments.new'),
              onClick: () => {
                history.push('/appointments/new')
              },
            },
          ],
        },
      ]}
    />
  )
}

export default Navbar
