import usePatientAppointments from '../../../patients/hooks/usePatientAppointments'
import PatientRepository from '../../../shared/db/PatientRepository'
import Appointment from '../../shared/model/Appointment'
import executeQuery from '../../test-utils/use-query.util'

describe('use patient appointments', () => {
  it(`should return the should return the patient's appointments`, async () => {
    const expectedPatientId = '123'

    const expectedAppointments = [
      {
        id: '456',
        rev: '1',
        patient: expectedPatientId,
        startDateTime: new Date(2020, 1, 1, 9, 0, 0, 0).toISOString(),
        endDateTime: new Date(2020, 1, 1, 9, 30, 0, 0).toISOString(),
        location: 'location',
        reason: 'Follow Up',
      },
      {
        id: '123',
        rev: '1',
        patient: expectedPatientId,
        startDateTime: new Date(2020, 1, 1, 8, 0, 0, 0).toISOString(),
        endDateTime: new Date(2020, 1, 1, 8, 30, 0, 0).toISOString(),
        location: 'location',
        reason: 'Checkup',
      },
    ] as Appointment[]

    jest.spyOn(PatientRepository, 'getAppointments').mockResolvedValueOnce(expectedAppointments)

    const actualAppointments = await executeQuery(() => usePatientAppointments(expectedPatientId))

    expect(PatientRepository.getAppointments).toHaveBeenCalledTimes(1)
    expect(PatientRepository.getAppointments).toHaveBeenCalledWith(expectedPatientId)
    expect(actualAppointments).toEqual(expectedAppointments)
  })
})
