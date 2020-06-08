import Permissions from './model/Permissions'

type Page = { permission: Permissions | null; label: string; path: string }

const pageMap: {
  [key: string]: Page
} = {
  dashboard: {
    permission: null,
    label: 'dashboard.label',
    path: '/',
  },
  newPatient: {
    permission: Permissions.WritePatients,
    label: 'patients.newPatient',
    path: '/patients/new',
  },
  viewPatients: {
    permission: Permissions.ReadPatients,
    label: 'patients.patientsList',
    path: '/patients',
  },
  newAppointment: {
    permission: Permissions.WriteAppointments,
    label: 'scheduling.appointments.new',
    path: '/appointments/new',
  },
  viewAppointments: {
    permission: Permissions.ReadAppointments,
    label: 'scheduling.appointments.schedule',
    path: '/appointments',
  },
  newLab: {
    permission: Permissions.RequestLab,
    label: 'labs.requests.new',
    path: '/labs/new',
  },
  viewLabs: {
    permission: Permissions.ViewLabs,
    label: 'labs.requests.label',
    path: '/labs',
  },
  newIncident: {
    permission: Permissions.ReportIncident,
    label: 'incidents.reports.new',
    path: '/incidents/new',
  },
  viewIncidents: {
    permission: Permissions.ViewIncidents,
    label: 'incidents.reports.label',
    path: '/incidents',
  },
  settings: {
    permission: null,
    label: 'settings.label',
    path: '/settings',
  },
}

export default pageMap
export type { Page }
