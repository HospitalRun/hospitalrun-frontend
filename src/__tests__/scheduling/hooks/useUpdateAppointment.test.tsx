import useUpdateAppointment from '../../../scheduling/hooks/useUpdateAppointment'
import AppointmentRepository from '../../../shared/db/AppointmentRepository'
import Appointment from '../../../shared/model/Appointment'
import executeMutation from '../../test-utils/use-mutation.util'

describe('Use update appointment', () => {
  const expectedAppointment = {
    id: '123',
    patient: '456',
    startDateTime: new Date(2020, 10, 1, 0, 0, 0, 0).toISOString(),
    endDateTime: new Date(2020, 10, 1, 1, 0, 0, 0).toISOString(),
    location: 'location',
    reason: 'reason',
    type: 'type',
  } as Appointment

  it('should update appointment', async () => {
    jest.spyOn(AppointmentRepository, 'saveOrUpdate').mockResolvedValue(expectedAppointment)
    const actualData = await executeMutation(() => {
      const result = useUpdateAppointment(expectedAppointment)
      return [result.mutate]
    }, expectedAppointment)

    expect(AppointmentRepository.saveOrUpdate).toHaveBeenCalledTimes(1)
    expect(AppointmentRepository.saveOrUpdate).toHaveBeenCalledWith(expectedAppointment)
    expect(actualData).toEqual(expectedAppointment)
  })
})
