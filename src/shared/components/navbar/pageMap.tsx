import Permissions from '../../model/Permissions'

type Page = { permission: Permissions | null; label: string; path: string; icon?: string }

const pageMap: {
  [key: string]: Page
} = {
  dashboard: {
    permission: null,
    label: 'dashboard.label',
    path: '/',
    icon: 'dashboard',
  },
  newPatient: {
    permission: Permissions.WritePatients,
    label: 'patients.newPatient',
    path: '/patients/new',
    icon: 'patient-add',
  },
  viewPatients: {
    permission: Permissions.ReadPatients,
    label: 'patients.patientsList',
    path: '/patients',
    icon: 'incident',
  },
  newAppointment: {
    permission: Permissions.WriteAppointments,
    label: 'scheduling.appointments.new',
    path: '/appointments/new',
    icon: 'appointment-add',
  },
  viewAppointments: {
    permission: Permissions.ReadAppointments,
    label: 'scheduling.appointments.schedule',
    path: '/appointments',
    icon: 'incident',
  },
  newLab: {
    permission: Permissions.RequestLab,
    label: 'labs.requests.new',
    path: '/labs/new',
    icon: 'add',
  },
  viewLabs: {
    permission: Permissions.ViewLabs,
    label: 'labs.requests.label',
    path: '/labs',
    icon: 'incident',
  },
  newIncident: {
    permission: Permissions.ReportIncident,
    label: 'incidents.reports.new',
    path: '/incidents/new',
    icon: 'add',
  },
  viewIncidents: {
    permission: Permissions.ViewIncidents,
    label: 'incidents.reports.label',
    path: '/incidents',
    icon: 'incident',
  },
  settings: {
    permission: null,
    label: 'settings.label',
    path: '/settings',
  },
}

export default pageMap
export type { Page }
