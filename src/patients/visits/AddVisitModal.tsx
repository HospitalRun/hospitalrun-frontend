import { Modal } from '@hospitalrun/components'
import { addMonths } from 'date-fns'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import useTranslator from '../../shared/hooks/useTranslator'
import Visit from '../../shared/model/Visit'
import { RootState } from '../../shared/store'
import { addVisit } from '../patient-slice'
import VisitForm from './VisitForm'

interface Props {
  show: boolean
  onCloseButtonClick: () => void
}

const initialVisitState = {
  startDateTime: new Date().toISOString(),
  endDateTime: addMonths(new Date(), 1).toISOString(),
}

const AddVisitModal = (props: Props) => {
  const { show, onCloseButtonClick } = props
  const dispatch = useDispatch()
  const { t } = useTranslator()
  const { visitError, patient } = useSelector((state: RootState) => state.patient)
  const [visit, setVisit] = useState(initialVisitState)

  useEffect(() => {
    setVisit(initialVisitState)
  }, [show])

  const onVisitChange = (newVisit: Partial<Visit>) => {
    setVisit(newVisit as Visit)
  }

  const onSaveButtonClick = () => {
    dispatch(addVisit(patient.id, visit as Visit))
  }

  const onClose = () => {
    onCloseButtonClick()
  }

  const body = <VisitForm visit={visit} visitError={visitError} onChange={onVisitChange} />
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
