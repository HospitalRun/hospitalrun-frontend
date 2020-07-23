import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import medicationSlice, {
  requestMedication,
  fetchMedicationStart,
  fetchMedicationSuccess,
  updateMedicationStart,
  updateMedicationSuccess,
  requestMedicationStart,
  requestMedicationSuccess,
  completeMedicationStart,
  completeMedicationSuccess,
  cancelMedicationStart,
  cancelMedicationSuccess,
  fetchMedication,
  cancelMedication,
  completeMedication,
  completeMedicationError,
  requestMedicationError,
  updateMedication,
} from '../../medications/medication-slice'
import MedicationRepository from '../../shared/db/MedicationRepository'
import PatientRepository from '../../shared/db/PatientRepository'
import Medication from '../../shared/model/Medication'
import Patient from '../../shared/model/Patient'
import { RootState } from '../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])

describe('medication slice', () => {
  describe('reducers', () => {
    describe('fetchMedicationStart', () => {
      it('should set status to loading', async () => {
        const medicationStore = medicationSlice(undefined, fetchMedicationStart())

        expect(medicationStore.status).toEqual('loading')
      })
    })

    describe('fetchMedicationSuccess', () => {
      it('should set the medication, patient, and status to success', () => {
        const expectedMedication = { id: 'medicationId' } as Medication
        const expectedPatient = { id: 'patient' } as Patient

        const medicationStore = medicationSlice(
          undefined,
          fetchMedicationSuccess({ medication: expectedMedication, patient: expectedPatient }),
        )

        expect(medicationStore.status).toEqual('completed')
        expect(medicationStore.medication).toEqual(expectedMedication)
        expect(medicationStore.patient).toEqual(expectedPatient)
      })
    })

    describe('updateMedicationStart', () => {
      it('should set status to loading', async () => {
        const medicationStore = medicationSlice(undefined, updateMedicationStart())

        expect(medicationStore.status).toEqual('loading')
      })
    })

    describe('updateMedicationSuccess', () => {
      it('should set the medication and status to success', () => {
        const expectedMedication = { id: 'medicationId' } as Medication

        const medicationStore = medicationSlice(
          undefined,
          updateMedicationSuccess(expectedMedication),
        )

        expect(medicationStore.status).toEqual('completed')
        expect(medicationStore.medication).toEqual(expectedMedication)
      })
    })

    describe('requestMedicationStart', () => {
      it('should set status to loading', async () => {
        const medicationStore = medicationSlice(undefined, requestMedicationStart())

        expect(medicationStore.status).toEqual('loading')
      })
    })

    describe('requestMedicationSuccess', () => {
      it('should set the medication and status to success', () => {
        const expectedMedication = { id: 'medicationId' } as Medication

        const medicationStore = medicationSlice(
          undefined,
          requestMedicationSuccess(expectedMedication),
        )

        expect(medicationStore.status).toEqual('completed')
        expect(medicationStore.medication).toEqual(expectedMedication)
      })
    })

    describe('requestMedicationError', () => {
      const expectedError = { message: 'some message', result: 'some result error' }

      const medicationStore = medicationSlice(undefined, requestMedicationError(expectedError))

      expect(medicationStore.status).toEqual('error')
      expect(medicationStore.error).toEqual(expectedError)
    })

    describe('completeMedicationStart', () => {
      it('should set status to loading', async () => {
        const medicationStore = medicationSlice(undefined, completeMedicationStart())

        expect(medicationStore.status).toEqual('loading')
      })
    })

    describe('completeMedicationSuccess', () => {
      it('should set the medication and status to success', () => {
        const expectedMedication = { id: 'medicationId' } as Medication

        const medicationStore = medicationSlice(
          undefined,
          completeMedicationSuccess(expectedMedication),
        )

        expect(medicationStore.status).toEqual('completed')
        expect(medicationStore.medication).toEqual(expectedMedication)
      })
    })

    describe('completeMedicationError', () => {
      const expectedError = { message: 'some message', result: 'some result error' }

      const medicationStore = medicationSlice(undefined, completeMedicationError(expectedError))

      expect(medicationStore.status).toEqual('error')
      expect(medicationStore.error).toEqual(expectedError)
    })

    describe('cancelMedicationStart', () => {
      it('should set status to loading', async () => {
        const medicationStore = medicationSlice(undefined, cancelMedicationStart())

        expect(medicationStore.status).toEqual('loading')
      })
    })

    describe('cancelMedicationSuccess', () => {
      it('should set the medication and status to success', () => {
        const expectedMedication = { id: 'medicationId' } as Medication

        const medicationStore = medicationSlice(
          undefined,
          cancelMedicationSuccess(expectedMedication),
        )

        expect(medicationStore.status).toEqual('completed')
        expect(medicationStore.medication).toEqual(expectedMedication)
      })
    })
  })

  describe('fetch medication', () => {
    let patientRepositorySpy: any
    let medicationRepositoryFindSpy: any

    const mockMedication = {
      id: 'medicationId',
      patient: 'patient',
      medication: 'medication',
      medication: 'medication',
      status: 'draft',
      intent: 'order',
      priority: 'routine',
      quantity: { value: 1, unit: 'unit' },
      notes: 'medication notes',
    } as Medication

    const mockPatient = {
      id: 'patient',
    } as Patient

    beforeEach(() => {
      patientRepositorySpy = jest.spyOn(PatientRepository, 'find').mockResolvedValue(mockPatient)
      medicationRepositoryFindSpy = jest
        .spyOn(MedicationRepository, 'find')
        .mockResolvedValue(mockMedication)
    })

    it('should fetch the medication and patient', async () => {
      const store = mockStore()

      await store.dispatch(fetchMedication(mockMedication.id))
      const actions = store.getActions()

      expect(actions[0]).toEqual(fetchMedicationStart())
      expect(medicationRepositoryFindSpy).toHaveBeenCalledWith(mockMedication.id)
      expect(patientRepositorySpy).toHaveBeenCalledWith(mockMedication.patient)
      expect(actions[1]).toEqual(
        fetchMedicationSuccess({ medication: mockMedication, patient: mockPatient }),
      )
    })
  })

  describe('cancel medication', () => {
    const mockMedication = {
      id: 'medicationId',
      patient: 'patient',
    } as Medication
    let medicationRepositorySaveOrUpdateSpy: any

    beforeEach(() => {
      Date.now = jest.fn().mockReturnValue(new Date().valueOf())
      medicationRepositorySaveOrUpdateSpy = jest
        .spyOn(MedicationRepository, 'saveOrUpdate')
        .mockResolvedValue(mockMedication)
    })

    it('should cancel a medication', async () => {
      const expectedCanceledMedication = {
        ...mockMedication,
        canceledOn: new Date(Date.now()).toISOString(),
        status: 'canceled',
      } as Medication

      const store = mockStore()

      await store.dispatch(cancelMedication(mockMedication))
      const actions = store.getActions()

      expect(actions[0]).toEqual(cancelMedicationStart())
      expect(medicationRepositorySaveOrUpdateSpy).toHaveBeenCalledWith(expectedCanceledMedication)
      expect(actions[1]).toEqual(cancelMedicationSuccess(expectedCanceledMedication))
    })

    it('should call on success callback if provided', async () => {
      const expectedCanceledMedication = {
        ...mockMedication,
        canceledOn: new Date(Date.now()).toISOString(),
        status: 'canceled',
      } as Medication

      const store = mockStore()
      const onSuccessSpy = jest.fn()
      await store.dispatch(cancelMedication(mockMedication, onSuccessSpy))

      expect(onSuccessSpy).toHaveBeenCalledWith(expectedCanceledMedication)
    })
  })

  describe('complete medication', () => {
    const mockMedication = {
      id: 'medicationId',
      patient: 'patient',
      medication: 'medication',
      status: 'draft',
      intent: 'order',
      priority: 'routine',
      quantity: { value: 1, unit: 'unit' },
      notes: 'notes',
    } as Medication
    let medicationRepositorySaveOrUpdateSpy: any

    beforeEach(() => {
      Date.now = jest.fn().mockReturnValue(new Date().valueOf())
      medicationRepositorySaveOrUpdateSpy = jest
        .spyOn(MedicationRepository, 'saveOrUpdate')
        .mockResolvedValue(mockMedication)
    })

    it('should complete a medication', async () => {
      const expectedCompletedMedication = {
        ...mockMedication,
        completedOn: new Date(Date.now()).toISOString(),
        status: 'completed',
      } as Medication

      const store = mockStore()

      await store.dispatch(completeMedication(mockMedication))
      const actions = store.getActions()

      expect(actions[0]).toEqual(completeMedicationStart())
      expect(medicationRepositorySaveOrUpdateSpy).toHaveBeenCalledWith(expectedCompletedMedication)
      expect(actions[1]).toEqual(completeMedicationSuccess(expectedCompletedMedication))
    })

    it('should call on success callback if provided', async () => {
      const expectedCompletedMedication = {
        ...mockMedication,
        completedOn: new Date(Date.now()).toISOString(),
        status: 'completed',
      } as Medication

      const store = mockStore()
      const onSuccessSpy = jest.fn()
      await store.dispatch(completeMedication(mockMedication, onSuccessSpy))

      expect(onSuccessSpy).toHaveBeenCalledWith(expectedCompletedMedication)
    })

    it('should validate that the medication can be completed', async () => {
      const store = mockStore()
      const onSuccessSpy = jest.fn()
      const medicationToComplete = mockMedication
      await store.dispatch(
        completeMedication({ ...medicationToComplete } as Medication, onSuccessSpy),
      )
      const actions = store.getActions()

      expect(actions[1]).not.toEqual(
        completeMedicationError({
          message: 'medications.requests.error.unableToComplete',
        }),
      )
      expect(onSuccessSpy).toHaveBeenCalled()
    })
  })

  describe('request medication', () => {
    const mockMedication = {
      id: 'medicationId',
      medication: 'medication',
      patient: 'patient',
      status: 'draft',
      intent: 'order',
      priority: 'routine',
      quantity: { value: 1, unit: 'unit' },
      notes: 'notes',
    } as Medication
    let medicationRepositorySaveSpy: any

    beforeEach(() => {
      jest.restoreAllMocks()
      Date.now = jest.fn().mockReturnValue(new Date().valueOf())
      medicationRepositorySaveSpy = jest
        .spyOn(MedicationRepository, 'save')
        .mockResolvedValue(mockMedication)
    })

    it('should request a new medication', async () => {
      const store = mockStore({
        user: {
          user: {
            id: 'fake id',
          },
        },
      } as any)

      const expectedRequestedMedication = {
        ...mockMedication,
        requestedOn: new Date(Date.now()).toISOString(),
        status: 'draft',
        requestedBy: store.getState().user.user?.id,
      } as Medication

      await store.dispatch(requestMedication(mockMedication))

      const actions = store.getActions()

      expect(actions[0]).toEqual(requestMedicationStart())
      expect(medicationRepositorySaveSpy).toHaveBeenCalledWith(expectedRequestedMedication)
      expect(actions[1]).toEqual(requestMedicationSuccess(expectedRequestedMedication))
    })

    it('should execute the onSuccess callback if provided', async () => {
      const store = mockStore({
        user: {
          user: {
            id: 'fake id',
          },
        },
      } as any)
      const onSuccessSpy = jest.fn()

      await store.dispatch(requestMedication(mockMedication, onSuccessSpy))

      expect(onSuccessSpy).toHaveBeenCalledWith(mockMedication)
    })
  })

  describe('update medication', () => {
    const mockMedication = ({
      id: 'medicationId',
      patient: 'patient',
      medication: 'medication',
      status: 'some status',
    } as unknown) as Medication
    let medicationRepositorySaveOrUpdateSpy: any

    const expectedUpdatedMedication = ({
      ...mockMedication,
      status: 'some other status',
    } as unknown) as Medication

    beforeEach(() => {
      Date.now = jest.fn().mockReturnValue(new Date().valueOf())
      medicationRepositorySaveOrUpdateSpy = jest
        .spyOn(MedicationRepository, 'saveOrUpdate')
        .mockResolvedValue(expectedUpdatedMedication)
    })

    it('should update the medication', async () => {
      const store = mockStore()

      await store.dispatch(updateMedication(expectedUpdatedMedication))
      const actions = store.getActions()

      expect(actions[0]).toEqual(updateMedicationStart())
      expect(medicationRepositorySaveOrUpdateSpy).toHaveBeenCalledWith(expectedUpdatedMedication)
      expect(actions[1]).toEqual(updateMedicationSuccess(expectedUpdatedMedication))
    })

    it('should call the onSuccess callback if successful', async () => {
      const store = mockStore()
      const onSuccessSpy = jest.fn()

      await store.dispatch(updateMedication(expectedUpdatedMedication, onSuccessSpy))

      expect(onSuccessSpy).toHaveBeenCalledWith(expectedUpdatedMedication)
    })
  })
})
