import React from 'react'
import { useParams } from 'react-router-dom'

import TextInputWithLabelFormGroup from '../../shared/components/input/TextInputWithLabelFormGroup'
import Loading from '../../shared/components/Loading'
import useTranslator from '../../shared/hooks/useTranslator'
import usePatientNote from '../hooks/usePatientNote'

const ViewNote = () => {
  const { t } = useTranslator()
  const { noteId, id: patientId } = useParams()
  const { data, status } = usePatientNote(patientId, noteId)

  if (data === undefined || status === 'loading') {
    return <Loading />
  }

  return (
    <div>
      <p>Date: {new Date(data.date).toLocaleString()}</p>
      <TextInputWithLabelFormGroup
        name="text"
        label={t('patient.note')}
        isEditable={false}
        placeholder={t('patient.note')}
        value={data.text}
      />
    </div>
  )
}

export default ViewNote
