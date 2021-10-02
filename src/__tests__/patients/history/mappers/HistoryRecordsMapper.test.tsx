import * as helpers from '../../../../patients/history/mappers/helpers'
import { mapHistoryRecords } from '../../../../patients/history/mappers/HistoryRecordsMapper'
import Appointment from '../../../../shared/model/Appointment'
import Lab from '../../../../shared/model/Lab'
import {
  PatientHistoryRecord,
  HistoryRecordType,
} from '../../../../shared/model/PatientHistoryRecord'

describe('test mapHistoryRecords', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should map history records correctly', () => {
    const mockLabs = [
      {
        id: '123',
        code: 'dummy',
        patient: 'dummy patient',
        type: 'emergency incident',
        status: 'completed',
        requestedOn: '01/01/2021',
        completedOn: '02/01/2021',
      },
    ] as Lab[]
    const mockAppts = [
      {
        id: '234',
        startDateTime: '01/04/2021',
        endDateTime: '01/05/2021',
        patient: 'dummy patient',
        reason: 'high blood pressure',
        type: 'annual checkup',
      },
    ] as Appointment[]
    const mockLabHistoryRecords = [
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
    const mockApptHistoryRecords = [
      {
        date: new Date('01/03/2021'),
        type: HistoryRecordType.APPOINTMENT,
        info: 'Started - regular checkup',
        recordId: '123',
        id: 'startedAppt123',
      },
      {
        date: new Date('02/03/2021'),
        type: HistoryRecordType.APPOINTMENT,
        info: 'Ended - regular checkup',
        recordId: '123',
        id: 'endedAppt123',
      },
    ] as PatientHistoryRecord[]
    jest.spyOn(helpers, 'convertLab').mockReturnValue(mockLabHistoryRecords)
    jest.spyOn(helpers, 'convertAppointment').mockReturnValue(mockApptHistoryRecords)
    const expectedMappedHistoryRecords = [
      mockApptHistoryRecords[1],
      mockLabHistoryRecords[1],
      mockApptHistoryRecords[0],
      mockLabHistoryRecords[0],
    ]
    const actualMappedHistoryRecords = mapHistoryRecords(mockLabs, mockAppts)
    expect(helpers.convertLab).toHaveBeenCalledTimes(1)
    expect(helpers.convertLab).toBeCalledWith(mockLabs[0])
    expect(helpers.convertAppointment).toHaveBeenCalledTimes(1)
    expect(helpers.convertAppointment).toBeCalledWith(mockAppts[0])
    expect(expectedMappedHistoryRecords).toEqual(actualMappedHistoryRecords)
  })
})
