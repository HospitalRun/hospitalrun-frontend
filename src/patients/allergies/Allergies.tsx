import { Button, List, ListItem, Alert } from '@hospitalrun/components'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Route, Switch, useHistory } from 'react-router-dom'

import useAddBreadcrumbs from '../../page-header/breadcrumbs/useAddBreadcrumbs'
import useTranslator from '../../shared/hooks/useTranslator'
import Allergy from '../../shared/model/Allergy'
import Patient from '../../shared/model/Patient'
import Permissions from '../../shared/model/Permissions'
import { RootState } from '../../shared/store'
import NewAllergyModal from './NewAllergyModal'
import ViewAllergy from './viewAllergy'

interface AllergiesProps {
  patient: Patient
}

const Allergies = (props: AllergiesProps) => {
  const { t } = useTranslator()
  const { patient } = props
  const { permissions } = useSelector((state: RootState) => state.user)
  const [showNewAllergyModal, setShowNewAllergyModal] = useState(false)
  const history = useHistory()

  const breadcrumbs = [
    {
      i18nKey: 'patient.allergies.label',
      location: `/patients/${patient.id}/allergies`,
    },
  ]
  useAddBreadcrumbs(breadcrumbs)

  return (
    <>
      <div className="row">
        <div className="col-md-12 d-flex justify-content-end">
          {permissions.includes(Permissions.AddAllergy) && (
            <Button
              outlined
              color="success"
              icon="add"
              iconLocation="left"
              onClick={() => setShowNewAllergyModal(true)}
            >
              {t('patient.allergies.new')}
            </Button>
          )}
        </div>
      </div>
      <br />
      <Switch>
        <Route exact path="/patients/:id/allergies">
          <List>
            {patient.allergies?.map((a: Allergy) => (
              <ListItem
                key={a.id}
                onClick={() => history.push(`/patients/${patient.id}/allergies/${a.id}`)}
              >
                {a.name}
              </ListItem>
            ))}
          </List>
        </Route>
        <Route exact path="/patients/:id/allergies/:allergyId">
          <ViewAllergy />
        </Route>
      </Switch>
      {(!patient.allergies || patient.allergies.length === 0) && (
        <Alert
          color="warning"
          title={t('patient.allergies.warning.noAllergies')}
          message={t('patient.allergies.addAllergyAbove')}
        />
      )}
      <NewAllergyModal
        show={showNewAllergyModal}
        onCloseButtonClick={() => setShowNewAllergyModal(false)}
      />
    </>
  )
}

export default Allergies
