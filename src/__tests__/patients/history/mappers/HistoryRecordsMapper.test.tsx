import { mapHistoryRecords } from '../../../../patients/history/mappers/HistoryRecordsMapper'
import PatientRepository from '../../../../shared/db/PatientRepository'
import Appointment from '../../../../shared/model/Appointment'
import Lab from '../../../../shared/model/Lab'
import Patient from '../../../../shared/model/Patient'
import { HistoryRecordType, PatientHistoryRecord } from '../../../../shared/model/PatientHistoryRecord'

const expectedLab: Lab = 
  {
    id: '123',
    rev: '1',
    patient: '1234',
    requestedOn: new Date(2020, 1, 1).toISOString(),
    requestedBy: 'someone',
    type: 'lab type',
    code: '',
    status: 'requested',
    createdAt: '',
    updatedAt: ''
  }

const expectedPatient = {
    id: '1234'
  } as Patient

const expectedAppointment: Appointment = {
  id: 'id',
  startDateTime: new Date(2020, 6, 3).toISOString(),
  endDateTime: new Date(2020, 6, 5).toISOString(),
  createdAt: new Date(2020, 6, 1).toISOString(),
  updatedAt: new Date(2020, 6, 1).toISOString(),
  type: 'standard type',
  reason: 'some reason',
  location: 'main building',
  patient: expectedPatient.id,
  rev: ''
}

const expectedPatientHistory: PatientHistoryRecord[] = 
[{
  date: new Date(expectedAppointment.startDateTime),
  type: HistoryRecordType.APPOINTMENT,
  info: expectedAppointment.type,
  recordId: expectedAppointment.id,
}, {
  date: new Date(expectedLab.requestedOn),
  type: HistoryRecordType.LAB,
  info: expectedLab.type,
  recordId: expectedLab.id
}]


describe('use patient history', () => {
  it('should get patient history', async () => {
    jest.spyOn(PatientRepository, 'getLabs').mockResolvedValue([expectedLab])
    jest.spyOn(PatientRepository, 'getAppointments').mockResolvedValue([expectedAppointment])
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(expectedPatient)

    const actualHistory = mapHistoryRecords([expectedLab], [expectedAppointment])

    expect(actualHistory).toEqual(expectedPatientHistory)
  })
})
