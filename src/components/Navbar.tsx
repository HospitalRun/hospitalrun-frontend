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
          // no oop
        },
        onChangeInput: () => {
          // no oop
        },
        placeholderText: t('actions.search'),
        buttonText: t('actions.search'),
      }}
      navLinks={[
        {
          label: t('patients.label'),
          onClick: () => {
            // no oop
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
        {
          label: t('scheduling.label'),
          onClick: () => {
            // no oop
          },
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
