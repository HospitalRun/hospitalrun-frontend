import { act } from '@testing-library/react-hooks'

import useAppointments from '../../../scheduling/hooks/useAppointments'
import AppointmentRepository from '../../../shared/db/AppointmentRepository'
import Appointment from '../../../shared/model/Appointment'

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

    // let actualData: any
    await act(async () => {
      // const renderHookResult = renderHook(() => useAppointments())
      const result = useAppointments()
      // await waitUntilQueryIsSuccessful(result)
      result.then((actualData) => {
        expect(AppointmentRepository.findAll).toHaveBeenCalledTimes(1)
        // expect(AppointmentRepository.findAll).toBeCalledWith(expectedAppointmentId)
        expect(actualData).toEqual(expectedAppointments)
      })
    })
  })
})
