import { MutateFunction, queryCache, useMutation } from 'react-query'

import AppointmentRepository from '../../shared/db/AppointmentRepository'
import Appointment from '../../shared/model/Appointment'
import validateAppointment, { AppointmentError } from '../appointments/util/validate-appointment'

interface updateAppointmentResult {
  mutate: MutateFunction<Appointment, unknown, Appointment, unknown>
  isLoading: boolean
  isError: boolean
  error: AppointmentError
}

async function updateAppointment(appointment: Appointment): Promise<Appointment> {
  return AppointmentRepository.saveOrUpdate(appointment)
}

export default function useUpdateAppointment(appointment: Appointment): updateAppointmentResult {
  const updateAppointmentError = validateAppointment(appointment)
  const [mutate, { isLoading, isError }] = useMutation(updateAppointment, {
    onSuccess: async () => {
      await queryCache.invalidateQueries('appointment')
    },
    throwOnError: true,
  })
  const result: updateAppointmentResult = {
    mutate,
    isLoading,
    isError,
    error: updateAppointmentError,
  }
  return result
}
