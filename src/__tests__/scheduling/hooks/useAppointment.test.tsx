import { renderHook, act } from '@testing-library/react-hooks'

import useAppointment from '../../../scheduling/hooks/useAppointment'
import AppointmentRepository from '../../../shared/db/AppointmentRepository'
import Appointment from '../../../shared/model/Appointment'
import waitUntilQueryIsSuccessful from '../../test-utils/wait-for-query.util'

describe('useAppointment', () => {
  it('should get an appointment by id', async () => {
    const expectedAppointmentId = 'some id'
    const expectedAppointment = {
      id: expectedAppointmentId,
    } as Appointment
    jest.spyOn(AppointmentRepository, 'find').mockResolvedValue(expectedAppointment)

    let actualData: any
    await act(async () => {
      const renderHookResult = renderHook(() => useAppointment(expectedAppointmentId))
      const { result } = renderHookResult
      await waitUntilQueryIsSuccessful(renderHookResult)
      actualData = result.current.data
    })

    expect(AppointmentRepository.find).toHaveBeenCalledTimes(1)
    expect(AppointmentRepository.find).toBeCalledWith(expectedAppointmentId)
    expect(actualData).toEqual(expectedAppointment)
  })
})
