import { convertLab, convertAppointment } from '../../../../patients/history/mappers/helpers'
import Appointment from '../../../../shared/model/Appointment'
import Lab from '../../../../shared/model/Lab'
import {
  PatientHistoryRecord,
  HistoryRecordType,
} from '../../../../shared/model/PatientHistoryRecord'

describe('test convertLab', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should convert requested lab events correctly', () => {
    const mockLab = {
      id: '123',
      code: 'dummy',
      patient: 'dummy patient',
      type: 'emergency incident',
      status: 'requested',
      requestedOn: '01/01/2021',
    } as Lab
    const expectedPatientHistoryRecords = [
      {
        date: new Date('01/01/2021'),
        type: HistoryRecordType.LAB,
        info: 'Requested - emergency incident',
        recordId: '123',
        id: 'requestedLab123',
      },
    ] as PatientHistoryRecord[]

    const actualPatientHistoryRecords = convertLab(mockLab)
    expect(actualPatientHistoryRecords).toEqual(expectedPatientHistoryRecords)
  })

  it('should convert completed lab events correctly', () => {
    const mockLab = {
      id: '123',
      code: 'dummy',
      patient: 'dummy patient',
      type: 'emergency incident',
      status: 'completed',
      requestedOn: '01/01/2021',
      completedOn: '02/01/2021',
    } as Lab
    const expectedPatientHistoryRecords = [
      {
        date: new Date('01/01/2021'),
        type: HistoryRecordType.LAB,
        info: 'Requested - emergency incident',
        recordId: '123',
        id: 'requestedLab123',
      },
      {
        date: new Date('02/01/2021'),
        type: HistoryRecordType.LAB,
        info: 'Completed - emergency incident',
        recordId: '123',
        id: 'completedLab123',
      },
    ] as PatientHistoryRecord[]

    const actualPatientHistoryRecords = convertLab(mockLab)
    expect(actualPatientHistoryRecords).toEqual(expectedPatientHistoryRecords)
  })

  it('should convert canceled lab events correctly', () => {
    const mockLab = {
      id: '123',
      code: 'dummy',
      patient: 'dummy patient',
      type: 'emergency incident',
      status: 'canceled',
      requestedOn: '01/01/2021',
      canceledOn: '02/01/2021',
    } as Lab
    const expectedPatientHistoryRecords = [
      {
        date: new Date('01/01/2021'),
        type: HistoryRecordType.LAB,
        info: 'Requested - emergency incident',
        recordId: '123',
        id: 'requestedLab123',
      },
      {
        date: new Date('02/01/2021'),
        type: HistoryRecordType.LAB,
        info: 'Canceled - emergency incident',
        recordId: '123',
        id: 'canceledLab123',
      },
    ] as PatientHistoryRecord[]

    const actualPatientHistoryRecords = convertLab(mockLab)
    expect(actualPatientHistoryRecords).toEqual(expectedPatientHistoryRecords)
  })
})

describe('test convertAppointment', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })
  it('should convert appointment events correctly', () => {
    const mockAppointment = {
      id: '123',
      startDateTime: '01/01/2021',
      endDateTime: '01/02/2021',
      patient: 'John Doe',
      reason: 'blood test',
      type: 'regular checkup',
    } as Appointment
    const expectedPatientHistoryRecords = [
      {
        date: new Date('01/01/2021'),
        type: HistoryRecordType.APPOINTMENT,
        info: 'Started - regular checkup',
        recordId: '123',
        id: 'startedAppt123',
      },
      {
        date: new Date('01/02/2021'),
        type: HistoryRecordType.APPOINTMENT,
        info: 'Ended - regular checkup',
        recordId: '123',
        id: 'endedAppt123',
      },
    ] as PatientHistoryRecord[]
    const actualPatientHistoryRecords = convertAppointment(mockAppointment)
    expect(actualPatientHistoryRecords).toEqual(expectedPatientHistoryRecords)
  })
})
