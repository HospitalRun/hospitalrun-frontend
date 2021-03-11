import { Modal } from '@hospitalrun/components'
import addMonths from 'date-fns/addMonths'
import React, { useState, useEffect } from 'react'

import useTranslator from '../../shared/hooks/useTranslator'
import Visit, { VisitStatus } from '../../shared/model/Visit'
import useAddVisit, { RequestVisit } from '../hooks/useAddVisit'
import VisitForm from './VisitForm'

interface Props {
  show: boolean
  onCloseButtonClick: () => void
  patientId: string
}

const initialVisitState = {
  startDateTime: new Date().toISOString(),
  endDateTime: addMonths(new Date(), 1).toISOString(),
  updatedAt: '',
  type: '',
  status: '' as VisitStatus,
  reason: '',
  location: '',
  rev: '',
}

const AddVisitModal = ({ show, onCloseButtonClick, patientId }: Props) => {
  const { t } = useTranslator()

  const [mutate] = useAddVisit()
  const [visit, setVisit] = useState<RequestVisit>(initialVisitState)
  const [error, setError] = useState<Error | undefined>(undefined)

  useEffect(() => {
    setVisit(initialVisitState)
  }, [show])

  const onVisitChange = (newVisit: Partial<Visit>) => {
    setVisit(newVisit as Visit)
  }
  const onClose = () => {
    onCloseButtonClick()
  }

  const onSaveButtonClick = async () => {
    try {
      await mutate({ patientId, visit })
      onClose()
    } catch (e) {
      setError(e)
    }
  }

  const body = <VisitForm visit={visit} visitError={error} onChange={onVisitChange} />
  return (
    <Modal
      show={show}
      toggle={onClose}
      title={t('patient.visits.new')}
      body={body}
      closeButton={{
        children: t('actions.cancel'),
        color: 'danger',
        onClick: onClose,
      }}
      successButton={{
        children: t('patient.visits.new'),
        color: 'success',
        icon: 'add',
        iconLocation: 'left',
        onClick: onSaveButtonClick,
      }}
    />
  )
}

export default AddVisitModal
