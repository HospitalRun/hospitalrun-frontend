import { Panel, Spinner, TabsHeader, Tab, Button } from '@hospitalrun/components'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
  useParams,
  withRouter,
  Route,
  useHistory,
  useLocation,
  useRouteMatch,
} from 'react-router-dom'

import useAddBreadcrumbs from '../../page-header/breadcrumbs/useAddBreadcrumbs'
import { useButtonToolbarSetter } from '../../page-header/button-toolbar/ButtonBarProvider'
import { useUpdateTitle } from '../../page-header/title/TitleContext'
import useTranslator from '../../shared/hooks/useTranslator'
import Permissions from '../../shared/model/Permissions'
import { RootState } from '../../shared/store'
import Allergies from '../allergies/Allergies'
import AppointmentsList from '../appointments/AppointmentsList'
import CareGoalTab from '../care-goals/CareGoalTab'
import CarePlanTab from '../care-plans/CarePlanTab'
import Diagnoses from '../diagnoses/Diagnoses'
import GeneralInformation from '../GeneralInformation'
import HistoryTab from '../history/HistoryTab'
import usePatient from '../hooks/usePatient'
import Labs from '../labs/Labs'
import Medications from '../medications/Medications'
import Note from '../notes/NoteTab'
import RelatedPerson from '../related-persons/RelatedPersonTab'
import { getPatientFullName } from '../util/patient-util'
import VisitTab from '../visits/VisitTab'
import ImportantPatientInfo from './ImportantPatientInfo'

const ViewPatient = () => {
  const { t } = useTranslator()
  const history = useHistory()
  const location = useLocation()
  const { path } = useRouteMatch()
  const setButtonToolBar = useButtonToolbarSetter()

  const { id } = useParams()
  const { permissions } = useSelector((state: RootState) => state.user)
  const { data: patient, status } = usePatient(id)

  const updateTitle = useUpdateTitle()
  useEffect(() => {
    updateTitle(t('patient.label'))
  }, [updateTitle, t])

  const breadcrumbs = [
    { i18nKey: 'patients.label', location: '/patients' },
    { text: getPatientFullName(patient), location: `/patients/${id}` },
  ]
  useAddBreadcrumbs(breadcrumbs, true)

  useEffect(() => {
    const buttons = []
    if (permissions.includes(Permissions.WritePatients)) {
      buttons.push(
        <Button
          key="editPatientButton"
          color="success"
          icon="edit"
          outlined
          onClick={() => {
            history.push(`/patients/edit/${id}`)
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
  }, [setButtonToolBar, history, id, permissions, t])

  if (status === 'loading' || !patient) {
    return <Spinner color="blue" loading size={[10, 25]} type="ScaleLoader" />
  }

  return (
    <div>
      {' '}
      <ImportantPatientInfo patient={patient} />
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
            active={location.pathname.startsWith(`/patients/${patient.id}/allergies`)}
            label={t('patient.allergies.label')}
            onClick={() => history.push(`/patients/${patient.id}/allergies`)}
          />
          <Tab
            active={location.pathname.startsWith(`/patients/${patient.id}/diagnoses`)}
            label={t('patient.diagnoses.label')}
            onClick={() => history.push(`/patients/${patient.id}/diagnoses`)}
          />
          <Tab
            active={location.pathname.startsWith(`/patients/${patient.id}/notes`)}
            label={t('patient.notes.label')}
            onClick={() => history.push(`/patients/${patient.id}/notes`)}
          />
          <Tab
            active={location.pathname === `/patients/${patient.id}/medications`}
            label={t('patient.medications.label')}
            onClick={() => history.push(`/patients/${patient.id}/medications`)}
          />
          <Tab
            active={location.pathname === `/patients/${patient.id}/labs`}
            label={t('patient.labs.label')}
            onClick={() => history.push(`/patients/${patient.id}/labs`)}
          />
          <Tab
            active={location.pathname.startsWith(`/patients/${patient.id}/care-plans`)}
            label={t('patient.carePlan.label')}
            onClick={() => history.push(`/patients/${patient.id}/care-plans`)}
          />
          <Tab
            active={location.pathname.startsWith(`/patients/${patient.id}/care-goals`)}
            label={t('patient.careGoal.label')}
            onClick={() => history.push(`/patients/${patient.id}/care-goals`)}
          />
          <Tab
            active={location.pathname.startsWith(`/patients/${patient.id}/visits`)}
            label={t('patient.visits.label')}
            onClick={() => history.push(`/patients/${patient.id}/visits`)}
          />
          <Tab
            active={location.pathname.startsWith(`/patients/${patient.id}/history`)}
            label={t('patient.history.label')}
            onClick={() => history.push(`/patients/${patient.id}/history`)}
          />
        </TabsHeader>
        <Panel>
          <Route exact path={path}>
            <GeneralInformation patient={patient} />
          </Route>
          <Route exact path={`${path}/relatedpersons`}>
            <RelatedPerson patient={patient} />
          </Route>
          <Route exact path={`${path}/appointments`}>
            <AppointmentsList patient={patient} />
          </Route>
          <Route path={`${path}/allergies`}>
            <Allergies patient={patient} />
          </Route>
          <Route path={`${path}/diagnoses`}>
            <Diagnoses />
          </Route>
          <Route exact path={`${path}/notes`}>
            <Note patient={patient} />
          </Route>
          <Route exact path={`${path}/medications`}>
            <Medications patient={patient} />
          </Route>
          <Route exact path={`${path}/labs`}>
            <Labs patient={patient} />
          </Route>
          <Route path={`${path}/care-plans`}>
            <CarePlanTab />
          </Route>
          <Route path={`${path}/care-goals`}>
            <CareGoalTab />
          </Route>
          <Route path={`${path}/visits`}>
            <VisitTab patientId={patient.id} />
          </Route>
          <Route path={`${path}/history`}>
            <HistoryTab patientId={patient.id} />
          </Route>
        </Panel>
      </div>
    </div>
  )
}

export default withRouter(ViewPatient)
