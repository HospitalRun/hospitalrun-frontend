import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, withRouter, Route, useHistory, useLocation } from 'react-router-dom'
import { Panel, Spinner, TabsHeader, Tab, Button } from '@hospitalrun/components'
import { useTranslation } from 'react-i18next'

import { useButtonToolbarSetter } from 'page-header/ButtonBarProvider'
import useTitle from '../../page-header/useTitle'
import { fetchPatient } from '../patient-slice'
import { RootState } from '../../store'
import { getPatientFullName } from '../util/patient-name-util'
import Patient from '../../model/Patient'
import GeneralInformation from '../GeneralInformation'
import RelatedPerson from '../related-persons/RelatedPersonTab'
import AppointmentsList from '../appointments/AppointmentsList'

const getFriendlyId = (p: Patient): string => {
  if (p) {
    return p.friendlyId
  }

  return ''
}

const ViewPatient = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const dispatch = useDispatch()
  const location = useLocation()

  const { patient, isLoading } = useSelector((state: RootState) => state.patient)

  useTitle(`${getPatientFullName(patient)} (${getFriendlyId(patient)})`)

  const setButtonToolBar = useButtonToolbarSetter()
  setButtonToolBar([
    <Button
      key="editPatientButton"
      color="success"
      icon="edit"
      outlined
      onClick={() => {
        history.push(`/patients/edit/${patient.id}`)
      }}
    >
      {t('actions.edit')}
    </Button>,
  ])

  const { id } = useParams()
  useEffect(() => {
    if (id) {
      dispatch(fetchPatient(id))
    }

    return () => {
      setButtonToolBar([])
    }
  }, [dispatch, id, setButtonToolBar])

  if (isLoading || !patient) {
    return <Spinner color="blue" loading size={[10, 25]} type="ScaleLoader" />
  }

  return (
    <div>
      <TabsHeader>
        <Tab
          active={location.pathname === `/patients/${patient.id}`}
          label={t('patient.generalInformation')}
          onClick={() => history.push(`/patients/${patient.id}`)}
        />
        <Tab
          active={location.pathname === `/patients/${patient.id}/relatedpersons`}
          label={t('patient.relatedPersons.label')}
          onClick={() => history.push(`/patients/${patient.id}/relatedpersons`)}
        />
        <Tab
          active={location.pathname === `/patients/${patient.id}/appointments`}
          label={t('scheduling.appointments.label')}
          onClick={() => history.push(`/patients/${patient.id}/appointments`)}
        />
      </TabsHeader>
      <Panel>
        <Route exact path="/patients/:id">
          <GeneralInformation patient={patient} />
        </Route>
        <Route exact path="/patients/:id/relatedpersons">
          <RelatedPerson patient={patient} />
        </Route>
        <Route exact path="/patients/:id/appointments">
          <AppointmentsList patientId={patient.id} />
        </Route>
      </Panel>
    </div>
  )
}

export default withRouter(ViewPatient)
