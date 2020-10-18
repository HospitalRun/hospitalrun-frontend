import { useQuery } from 'react-query'

import AppointmentRepository from '../../shared/db/AppointmentRepository'
import Appointment from '../../shared/model/Appointment'

async function fetchAppointments(): Promise<Appointment[]> {
  const fetchedAppointments = await AppointmentRepository.findAll()
  return fetchedAppointments || []
}

export default function useAppointments() {
  return useQuery(['appointments'], fetchAppointments)
}
