import { MutateFunction, queryCache, useMutation } from 'react-query'

import AppointmentRepository from '../../shared/db/AppointmentRepository'
import Appointment from '../../shared/model/Appointment'
import validateAppointment, { AppointmentError } from '../appointments/util/validate-appointment'

interface newAppointmentResult {
  mutate: MutateFunction<Appointment, unknown, Appointment, unknown>
  isLoading: boolean
  isError: boolean
  validator(appointment: Appointment): AppointmentError
}

async function createNewAppointment(appointment: Appointment): Promise<Appointment> {
  return AppointmentRepository.save(appointment)
}

function validateCreateAppointment(appointment: Appointment): AppointmentError {
  return validateAppointment(appointment)
}

export default function useScheduleAppointment(): newAppointmentResult {
  const [mutate, { isLoading, isError }] = useMutation(createNewAppointment, {
    onSuccess: async () => {
      await queryCache.invalidateQueries('appointment')
    },
    throwOnError: true,
  })
  const result: newAppointmentResult = {
    mutate,
    isLoading,
    isError,
    validator: validateCreateAppointment,
  }
  return result
}
