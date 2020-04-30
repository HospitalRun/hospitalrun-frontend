import React, { useState } from 'react'
import useAddBreadcrumbs from 'breadcrumbs/useAddBreadcrumbs'
import Patient from 'model/Patient'
import { Button, List, ListItem, Alert } from '@hospitalrun/components'
import { useSelector } from 'react-redux'
import { RootState } from 'store'
import Permissions from 'model/Permissions'
import { useTranslation } from 'react-i18next'
import Allergy from 'model/Allergy'
import NewAllergyModal from './NewAllergyModal'

interface AllergiesProps {
  patient: Patient
}

const Allergies = (props: AllergiesProps) => {
  const { t } = useTranslation()
  const { patient } = props
  const { permissions } = useSelector((state: RootState) => state.user)
  const [showNewAllergyModal, setShowNewAllergyModal] = useState(false)

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
      {(!patient.allergies || patient.allergies.length === 0) && (
        <Alert
          color="warning"
          title={t('patient.allergies.warning.noAllergies')}
          message={t('patient.allergies.addAllergyAbove')}
        />
      )}
      <List>
        {patient.allergies?.map((a: Allergy) => (
          <ListItem key={a.id}>{a.name}</ListItem>
        ))}
      </List>
      <NewAllergyModal
        show={showNewAllergyModal}
        onCloseButtonClick={() => setShowNewAllergyModal(false)}
      />
    </>
  )
}

export default Allergies
