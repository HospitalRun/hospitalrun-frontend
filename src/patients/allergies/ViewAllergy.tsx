import React from 'react'
import { useParams } from 'react-router-dom'

import TextInputWithLabelFormGroup from '../../shared/components/input/TextInputWithLabelFormGroup'
import Loading from '../../shared/components/Loading'
import useTranslator from '../../shared/hooks/useTranslator'
import useAllergy from '../hooks/useAllergy'

const ViewAllergy = () => {
  const { t } = useTranslator()
  const { allergyId, id: patientId } = useParams()
  const { data, status } = useAllergy(patientId, allergyId)

  if (data === undefined || status === 'loading') {
    return <Loading />
  }

  return (
    <>
      <TextInputWithLabelFormGroup
        name="allergy"
        label={t('patient.allergies.allergyName')}
        isEditable={false}
        placeholder={t('patient.allergies.allergyName')}
        value={data.name}
      />
    </>
  )
}

export default ViewAllergy
