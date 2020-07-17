import { Modal } from '@hospitalrun/components'
import React from 'react'
import { Link } from 'react-router-dom'

import useTranslator from '../../shared/hooks/useTranslator'
import Patient from '../../shared/model/Patient'

interface Props {
  duplicatePatient?: Patient
  show: boolean
  toggle: () => void
  onCloseButtonClick: () => void
  onContinueButtonClick: () => void
}

const DuplicateNewPatientModal = (props: Props) => {
  const { t } = useTranslator()
  const { duplicatePatient, show, toggle, onCloseButtonClick, onContinueButtonClick } = props

  const body = (
    <div className="row">
      <div className="col-md-12">
        <p>
          Possible duplicate of:{' '}
          {duplicatePatient !== undefined && (
            <Link to={`/patients/${duplicatePatient.id}`}>{duplicatePatient.fullName}</Link>
          )}
        </p>
        <p>Are you sure you want to create this patient?</p>
      </div>
    </div>
  )

  return (
    <Modal
      show={show}
      toggle={toggle}
      title={t('Warning')}
      body={body}
      closeButton={{
        children: t('actions.cancel'),
        color: 'danger',
        onClick: onCloseButtonClick,
      }}
      successButton={{
        children: t('Continue'),
        color: 'success',
        onClick: onContinueButtonClick,
      }}
    />
  )
}

export default DuplicateNewPatientModal
