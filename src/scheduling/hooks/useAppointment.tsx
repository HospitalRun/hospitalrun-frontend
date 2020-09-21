import { QueryKey, useQuery } from 'react-query'

import AppointmentRepository from '../../shared/db/AppointmentRepository'
import Appointment from '../../shared/model/Appointment'

function getAppointmentById(_: QueryKey<string>, appointmentId: string): Promise<Appointment> {
  return AppointmentRepository.find(appointmentId)
}

export default function useAppointment(appointmentId: string) {
  return useQuery(['appointment', appointmentId], getAppointmentById)
}
