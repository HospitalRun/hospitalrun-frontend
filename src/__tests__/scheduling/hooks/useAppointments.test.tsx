import useAppointments from '../../../scheduling/hooks/useAppointments'
import AppointmentRepository from '../../../shared/db/AppointmentRepository'
import Appointment from '../../../shared/model/Appointment'
import executeQuery from '../../test-utils/use-query.util'

describe('useAppointments', () => {
  it('should get an appointment by id', async () => {
    const expectedAppointmentId = '123'

    const expectedAppointments = [
      {
        id: '456',
        rev: '1',
        patient: expectedAppointmentId,
        startDateTime: new Date(2020, 1, 1, 9, 0, 0, 0).toISOString(),
        endDateTime: new Date(2020, 1, 1, 9, 30, 0, 0).toISOString(),
        location: 'location',
        reason: 'Follow Up',
      },
      {
        id: '123',
        rev: '1',
        patient: expectedAppointmentId,
        startDateTime: new Date(2020, 1, 1, 8, 0, 0, 0).toISOString(),
        endDateTime: new Date(2020, 1, 1, 8, 30, 0, 0).toISOString(),
        location: 'location',
        reason: 'Checkup',
      },
    ] as Appointment[]
    jest.spyOn(AppointmentRepository, 'findAll').mockResolvedValue(expectedAppointments)

    const actualData = await executeQuery(() => useAppointments())

    expect(AppointmentRepository.findAll).toHaveBeenCalledTimes(1)
    expect(actualData).toEqual(expectedAppointments)
  })
})
