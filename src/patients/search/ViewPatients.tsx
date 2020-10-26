import { Button } from '@hospitalrun/components'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router'

import useAddBreadcrumbs from '../../page-header/breadcrumbs/useAddBreadcrumbs'
import { useButtonToolbarSetter } from '../../page-header/button-toolbar/ButtonBarProvider'
import { useUpdateTitle } from '../../page-header/title/TitleContext'
import useTranslator from '../../shared/hooks/useTranslator'
import SearchPatients from './SearchPatients'

const breadcrumbs = [{ i18nKey: 'patients.label', location: '/patients' }]

const ViewPatients = () => {
  const { t } = useTranslator()
  const history = useHistory()
  const updateTitle = useUpdateTitle()
  useEffect(() => {
    updateTitle(t('patients.label'))
  })
  const dispatch = useDispatch()
  const setButtonToolBar = useButtonToolbarSetter()

  useAddBreadcrumbs(breadcrumbs, true)

  useEffect(() => {
    setButtonToolBar([
      <Button
        key="newPatientButton"
        outlined
        color="success"
        icon="patient-add"
        onClick={() => history.push('/patients/new')}
      >
        {t('patients.newPatient')}
      </Button>,
    ])
    return () => {
      setButtonToolBar([])
    }
  }, [dispatch, setButtonToolBar, t, history])

  return <SearchPatients />
}

export default ViewPatients
