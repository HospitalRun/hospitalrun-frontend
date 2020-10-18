import useDeleteAppointment from '../../../scheduling/hooks/useDeleteAppointment'
import AppointmentRepository from '../../../shared/db/AppointmentRepository'
import Appointment from '../../../shared/model/Appointment'
import * as uuid from '../../../shared/util/uuid'
import executeMutation from '../../test-utils/use-mutation.util'

describe('use delete appoinment', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should remove an appointment with the given id', async () => {
    const expectedAppointmentId = '123'

    const expectedAppointment = {
      id: '123',
      patient: '456',
      startDateTime: new Date(2020, 10, 1, 0, 0, 0, 0).toISOString(),
      endDateTime: new Date(2020, 10, 1, 1, 0, 0, 0).toISOString(),
      location: 'location',
      reason: 'reason',
      type: 'type',
    } as Appointment

    jest.spyOn(AppointmentRepository, 'find').mockResolvedValue(expectedAppointment)
    jest.spyOn(uuid, 'uuid').mockReturnValue(expectedAppointmentId)
    jest.spyOn(AppointmentRepository, 'delete').mockResolvedValue(expectedAppointment)

    const result = await executeMutation(() => useDeleteAppointment(), {
      appointmentId: expectedAppointmentId,
    })

    expect(AppointmentRepository.find).toHaveBeenCalledTimes(1)
    expect(AppointmentRepository.delete).toHaveBeenCalledTimes(1)
    expect(AppointmentRepository.delete).toHaveBeenCalledWith(expectedAppointment)
    expect(result).toEqual(expectedAppointment)
  })
})
