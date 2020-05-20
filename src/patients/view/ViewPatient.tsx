import { Panel, Spinner, TabsHeader, Tab, Button } from '@hospitalrun/components'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, withRouter, Route, useHistory, useLocation } from 'react-router-dom'

import useAddBreadcrumbs from '../../breadcrumbs/useAddBreadcrumbs'
import Patient from '../../model/Patient'
import Permissions from '../../model/Permissions'
import { useButtonToolbarSetter } from '../../page-header/ButtonBarProvider'
import useTitle from '../../page-header/useTitle'
import { RootState } from '../../store'
import Allergies from '../allergies/Allergies'
import AppointmentsList from '../appointments/AppointmentsList'
import Diagnoses from '../diagnoses/Diagnoses'
import GeneralInformation from '../GeneralInformation'
import Labs from '../labs/LabsTab'
import Note from '../notes/NoteTab'
import { fetchPatient } from '../patient-slice'
import RelatedPerson from '../related-persons/RelatedPersonTab'
import { getPatientFullName } from '../util/patient-name-util'
import CarePlanTab from "../care-plans/CarePlanTab";

const getPatientCode = (p: Patient): string => {
  if (p) {
    return p.code
  }

  return ''
}

const ViewPatient = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const dispatch = useDispatch()
  const location = useLocation()

  const { patient, status } = useSelector((state: RootState) => state.patient)
  const { permissions } = useSelector((state: RootState) => state.user)

  useTitle(`${getPatientFullName(patient)} (${getPatientCode(patient)})`)

  const setButtonToolBar = useButtonToolbarSetter()

  const breadcrumbs = [
    { i18nKey: 'patients.label', location: '/patients' },
    { text: getPatientFullName(patient), location: `/patients/${patient.id}` },
  ]
  useAddBreadcrumbs(breadcrumbs, true)

  const { id } = useParams()
  useEffect(() => {
    if (id) {
      dispatch(fetchPatient(id))
    }

    const buttons = []
    if (permissions.includes(Permissions.WritePatients)) {
      buttons.push(
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
      )
    }

    setButtonToolBar(buttons)

    return () => {
      setButtonToolBar([])
    }
  }, [dispatch, id, setButtonToolBar, history, patient.id, permissions, t])

  if (status === 'loading' || !patient) {
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
        <Tab
          active={location.pathname === `/patients/${patient.id}/allergies`}
          label={t('patient.allergies.label')}
          onClick={() => history.push(`/patients/${patient.id}/allergies`)}
        />
        <Tab
          active={location.pathname === `/patients/${patient.id}/diagnoses`}
          label={t('patient.diagnoses.label')}
          onClick={() => history.push(`/patients/${patient.id}/diagnoses`)}
        />
        <Tab
          active={location.pathname === `/patients/${patient.id}/notes`}
          label={t('patient.notes.label')}
          onClick={() => history.push(`/patients/${patient.id}/notes`)}
        />
        <Tab
          active={location.pathname === `/patients/${patient.id}/labs`}
          label={t('patient.labs.label')}
          onClick={() => history.push(`/patients/${patient.id}/labs`)}
        />
        <Tab
          active={location.pathname === `/patients/${patient.id}/care-plans`}
          label={t('patient.carePlan.label')}
          onClick={() => history.push(`/patients/${patient.id}/care-plans`)}
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
        <Route exact path="/patients/:id/allergies">
          <Allergies patient={patient} />
        </Route>
        <Route exact path="/patients/:id/diagnoses">
          <Diagnoses patient={patient} />
        </Route>
        <Route exact path="/patients/:id/notes">
          <Note patient={patient} />
        </Route>
        <Route exact path="/patients/:id/labs">
          <Labs patientId={patient.id} />
        </Route>
        <Route exact path="/patients/:id/care-plans">
          <CarePlanTab patientId={patient.id} />
        </Route>
      </Panel>
    </div>
  )
}

export default withRouter(ViewPatient)
