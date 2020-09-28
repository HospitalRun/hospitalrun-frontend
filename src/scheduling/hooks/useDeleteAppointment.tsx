import { queryCache, useMutation } from 'react-query'

import AppointmentRepository from '../../shared/db/AppointmentRepository'
import Appointment from '../../shared/model/Appointment'

interface deleteAppointmentRequest {
  appointmentId: string
}

async function deleteAppointment(request: deleteAppointmentRequest): Promise<Appointment> {
  const appointment = await AppointmentRepository.find(request.appointmentId)
  return AppointmentRepository.delete(appointment)
}

export default function useDeleteAppointment() {
  return useMutation(deleteAppointment, {
    onSuccess: async () => {
      await queryCache.invalidateQueries('appointment')
    },
  })
}
