import useAppointment from '../../../scheduling/hooks/useAppointment'
import AppointmentRepository from '../../../shared/db/AppointmentRepository'
import Appointment from '../../../shared/model/Appointment'
import executeQuery from '../../test-utils/use-query.util'

describe('useAppointment', () => {
  it('should get an appointment by id', async () => {
    const expectedAppointmentId = 'some id'
    const expectedAppointment = {
      id: expectedAppointmentId,
    } as Appointment
    jest.spyOn(AppointmentRepository, 'find').mockResolvedValue(expectedAppointment)

    const actualData = await executeQuery(() => useAppointment(expectedAppointmentId))

    expect(AppointmentRepository.find).toHaveBeenCalledTimes(1)
    expect(AppointmentRepository.find).toBeCalledWith(expectedAppointmentId)
    expect(actualData).toEqual(expectedAppointment)
  })
})
