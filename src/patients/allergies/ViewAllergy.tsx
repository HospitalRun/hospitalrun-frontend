import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import TextInputWithLabelFormGroup from '../../shared/components/input/TextInputWithLabelFormGroup'
import useTranslator from '../../shared/hooks/useTranslator'
import Allergy from '../../shared/model/Allergy'
import { RootState } from '../../shared/store'

const ViewAllergy = () => {
  const { t } = useTranslator()
  const { patient } = useSelector((root: RootState) => root.patient)
  const { allergyId } = useParams()

  const [allergy, setAllergy] = useState<Allergy | undefined>()

  useEffect(() => {
    if (patient && allergyId) {
      const currentAllergy = patient.allergies?.find((a: Allergy) => a.id === allergyId)
      setAllergy(currentAllergy)
    }
  }, [setAllergy, allergyId, patient])

  if (allergy) {
    return (
      <>
        <TextInputWithLabelFormGroup
          name="name"
          label={t('patient.allergies.allergyName')}
          isEditable={false}
          placeholder={t('patient.allergies.allergyName')}
          value={allergy.name}
        />
      </>
    )
  }
  return <></>
}

export default ViewAllergy
