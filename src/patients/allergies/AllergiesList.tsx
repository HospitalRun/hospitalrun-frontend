import { List, ListItem } from '@hospitalrun/components'
import React from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import Allergy from '../../shared/model/Allergy'
import { RootState } from '../../shared/store'

const AllergiesList = () => {
  const history = useHistory()
  const { patient } = useSelector((state: RootState) => state.patient)

  return (
    <List>
      {patient.allergies?.map((a: Allergy) => (
        <ListItem
          action
          key={a.id}
          onClick={() => history.push(`/patients/${patient.id}/allergies/${a.id}`)}
        >
          {a.name}
        </ListItem>
      ))}
    </List>
  )
}

export default AllergiesList
