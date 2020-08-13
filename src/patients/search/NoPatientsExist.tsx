import { Button, Icon, Typography } from '@hospitalrun/components'
import React from 'react'
import { useHistory } from 'react-router-dom'

import useTranslator from '../../shared/hooks/useTranslator'

const NoPatientsExist = () => {
  const history = useHistory()
  const { t } = useTranslator()

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Icon icon="patients" outline={false} size="6x" />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', width: '60%', margin: 16 }}>
            <Typography variant="h5">{t('patients.noPatients')}</Typography>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            key="newPatientButton"
            outlined
            color="primary"
            icon="patient-add"
            onClick={() => history.push('/patients/new')}
          >
            {t('patients.newPatient')}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NoPatientsExist
