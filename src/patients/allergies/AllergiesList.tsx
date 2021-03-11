import { Alert, List, ListItem } from '@hospitalrun/components'
import React from 'react'
import { useHistory } from 'react-router-dom'

import Loading from '../../shared/components/Loading'
import useTranslator from '../../shared/hooks/useTranslator'
import Allergy from '../../shared/model/Allergy'
import usePatientAllergies from '../hooks/usePatientAllergies'

interface Props {
  patientId: string
}

const AllergiesList = (props: Props) => {
  const { patientId } = props
  const history = useHistory()
  const { t } = useTranslator()
  const { data, status } = usePatientAllergies(patientId)

  if (data === undefined || status === 'loading') {
    return <Loading />
  }

  if (data.length === 0) {
    return (
      <Alert
        color="warning"
        title={t('patient.allergies.warning.noAllergies')}
        message={t('patient.allergies.addAllergyAbove')}
      />
    )
  }

  return (
    <List>
      {data.map((a: Allergy) => (
        <ListItem
          action
          key={a.id}
          onClick={() => history.push(`/patients/${patientId}/allergies/${a.id}`)}
        >
          {a.name}
        </ListItem>
      ))}
    </List>
  )
}

export default AllergiesList
