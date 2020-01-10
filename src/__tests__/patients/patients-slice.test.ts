import '../../__mocks__/matchMediaMock'
import { AnyAction } from 'redux'
import { createMemoryHistory } from 'history'
import { mocked } from 'ts-jest/utils'
import * as components from '@hospitalrun/components'
import { useTranslation } from 'react-i18next'
import * as patientsSlice from '../../patients/patients-slice'
import Patient from '../../model/Patient'
import PatientRepository from '../../clients/db/PatientRepository'

const { t } = useTranslation()

describe('patients slice', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('patients reducer', () => {
    it('should create the proper initial state with empty patients array', () => {
      const patientsStore = patientsSlice.default(undefined, {} as AnyAction)
      expect(patientsStore.isLoading).toBeFalsy()
      expect(patientsStore.patients).toHaveLength(0)
    })

    it('should handle the CREATE_PATIENT_START action', () => {
      const patientsStore = patientsSlice.default(undefined, {
        type: patientsSlice.createPatientStart.type,
      })

      expect(patientsStore.isLoading).toBeTruthy()
    })

    it('should handle the CREATE_PATIENT_SUCCESS actions', () => {
      const patientsStore = patientsSlice.default(undefined, {
        type: patientsSlice.createPatientSuccess().type,
      })

      expect(patientsStore.isLoading).toBeFalsy()
    })
  })

  describe('createPatient()', () => {
    it('should dispatch the CREATE_PATIENT_START action', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()
      const expectedPatient = {
        id: 'id',
      } as Patient

      await patientsSlice.createPatient(expectedPatient, createMemoryHistory())(
        dispatch,
        getState,
        null,
      )

      expect(dispatch).toHaveBeenCalledWith({ type: patientsSlice.createPatientStart.type })
    })

    it('should call the PatientRepository save method with the correct patient', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()
      jest.spyOn(PatientRepository, 'save')
      const expectedPatient = {
        id: 'id',
      } as Patient

      await patientsSlice.createPatient(expectedPatient, createMemoryHistory())(
        dispatch,
        getState,
        null,
      )

      expect(PatientRepository.save).toHaveBeenCalledWith(expectedPatient)
    })

    it('should dispatch the CREATE_PATIENT_SUCCESS action', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()
      const mockedPatientRepository = mocked(PatientRepository, true)
      mockedPatientRepository.save.mockResolvedValue({ id: '12345' } as Patient)
      const expectedPatient = {
        id: 'id',
      } as Patient

      await patientsSlice.createPatient(expectedPatient, createMemoryHistory())(
        dispatch,
        getState,
        null,
      )

      expect(dispatch).toHaveBeenCalledWith({ type: patientsSlice.createPatientSuccess().type })
    })

    it('should navigate to the /patients/:id where id is the new patient id', async () => {
      const expectedPatientId = '12345'
      const mockedPatientRepository = mocked(PatientRepository, true)
      mockedPatientRepository.save.mockResolvedValue({ id: expectedPatientId } as Patient)
      const history = createMemoryHistory()

      const dispatch = jest.fn()
      const getState = jest.fn()
      const expectedPatient = {} as Patient

      await patientsSlice.createPatient(expectedPatient, history)(dispatch, getState, null)

      expect(history.entries[1].pathname).toEqual(`/patients/${expectedPatientId}`)
    })

    it('should call the Toaster function with the correct data', async () => {
      jest.spyOn(components, 'Toast')
      const expectedPatientId = '12345'
      const expectedGivenName = 'given'
      const expectedFamilyName = 'family'
      const expectedSuffix = 'suffix'
      const expectedPatient = {
        id: expectedPatientId,
        givenName: expectedGivenName,
        familyName: expectedFamilyName,
        suffix: expectedSuffix,
      } as Patient
      const mockedPatientRepository = mocked(PatientRepository, true)
      mockedPatientRepository.save.mockResolvedValue(expectedPatient)
      const mockedComponents = mocked(components, true)
      const history = createMemoryHistory()
      const dispatch = jest.fn()
      const getState = jest.fn()

      await patientsSlice.createPatient(expectedPatient, history)(dispatch, getState, null)

      expect(mockedComponents.Toast).toHaveBeenCalledWith(
        'success',
        'Success!',
        `patients.successfullyCreated ${expectedGivenName} ${expectedFamilyName} ${expectedSuffix}`,
      )
    })
  })
})
