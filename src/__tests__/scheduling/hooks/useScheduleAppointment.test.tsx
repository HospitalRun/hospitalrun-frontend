import * as AppointmentValidator from '../../../scheduling/appointments/util/validate-appointment'
import { AppointmentError } from '../../../scheduling/appointments/util/validate-appointment'
import useScheduleAppointment from '../../../scheduling/hooks/useScheduleAppointment'
import AppointmentRepository from '../../../shared/db/AppointmentRepository'
import Appointment from '../../../shared/model/Appointment'
import executeMutation from '../../test-utils/use-mutation.util'

describe('useScheduleAppointment', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it('should save the appointment with correct data', async () => {
    const expectedAppointment = {
      patient: 'Granny Getyourgun',
      startDateTime: new Date(2020, 10, 1, 0, 0, 0, 0).toISOString(),
      endDateTime: new Date(2020, 10, 1, 1, 0, 0, 0).toISOString(),
      location: 'location',
      reason: 'reason',
      type: 'type',
    } as Appointment

    jest.spyOn(AppointmentRepository, 'save').mockResolvedValue(expectedAppointment)

    const actualData = await executeMutation(() => {
      const result = useScheduleAppointment()
      return [result.mutate]
    }, expectedAppointment)
    expect(AppointmentRepository.save).toHaveBeenCalledTimes(1)
    expect(AppointmentRepository.save).toBeCalledWith(expectedAppointment)
    expect(actualData).toEqual(expectedAppointment)
  })

  it('should throw an error if validation fails', async () => {
    const expectedAppointmentError = {
      message: 'scheduling.appointment.errors.createAppointmentError',
      patient: 'scheduling.appointment.errors.patientRequired',
      startDateTime: 'scheduling.appointment.errors.startDateMustBeBeforeEndDate',
    } as AppointmentError

    jest.spyOn(AppointmentValidator, 'default').mockReturnValue(expectedAppointmentError)
    jest.spyOn(AppointmentRepository, 'save').mockResolvedValue({} as Appointment)

    try {
      await executeMutation(() => {
        const result = useScheduleAppointment()
        return [result.mutate]
      }, {} as Appointment)
    } catch (e) {
      expect(e).toEqual(expectedAppointmentError)
      expect(AppointmentRepository.save).not.toHaveBeenCalled()
    }
  })
})
