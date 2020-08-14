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
  cancelMedicationStart,
  cancelMedicationSuccess,
  fetchMedication,
  cancelMedication,
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
  const setup = () => {
    const mockMedication = {
      id: 'medicationId',
      patient: 'patient',
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
    return [mockMedication, mockPatient]
  }
  describe('reducers', () => {
    describe('fetchMedicationStart', () => {
      it('should set status to loading', async () => {
        const medicationStore = medicationSlice(undefined, fetchMedicationStart())

        expect(medicationStore.status).toEqual('loading')
      })
    })

    describe('fetchMedicationSuccess', () => {
      it('should set the medication, patient, and status to success', () => {
        const [expectedMedication, expectedPatient] = setup()
        const medicationStore = medicationSlice(
          undefined,
          fetchMedicationSuccess({
            medication: expectedMedication as Medication,
            patient: expectedPatient as Patient,
          }),
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
        const [expectedMedication] = setup()

        const medicationStore = medicationSlice(
          undefined,
          updateMedicationSuccess(expectedMedication as Medication),
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
        const [expectedMedication] = setup()

        const medicationStore = medicationSlice(
          undefined,
          requestMedicationSuccess(expectedMedication as Medication),
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

    describe('cancelMedicationStart', () => {
      it('should set status to loading', async () => {
        const medicationStore = medicationSlice(undefined, cancelMedicationStart())

        expect(medicationStore.status).toEqual('loading')
      })
    })

    describe('cancelMedicationSuccess', () => {
      it('should set the medication and status to success', () => {
        const [expectedMedication] = setup()

        const medicationStore = medicationSlice(
          undefined,
          cancelMedicationSuccess(expectedMedication as Medication),
        )

        expect(medicationStore.status).toEqual('completed')
        expect(medicationStore.medication).toEqual(expectedMedication)
      })
    })
  })

  describe('fetch medication', () => {
    let patientRepositorySpy: any
    let medicationRepositoryFindSpy: any

    const [mockMedication, mockPatient] = setup()

    beforeEach(() => {
      patientRepositorySpy = jest
        .spyOn(PatientRepository, 'find')
        .mockResolvedValue(mockPatient as Patient)
      medicationRepositoryFindSpy = jest
        .spyOn(MedicationRepository, 'find')
        .mockResolvedValue(mockMedication as Medication)
    })

    it('should fetch the medication and patient', async () => {
      const store = mockStore()

      await store.dispatch(fetchMedication(mockMedication.id))
      const actions = store.getActions()

      expect(actions[0]).toEqual(fetchMedicationStart())
      expect(medicationRepositoryFindSpy).toHaveBeenCalledWith(mockMedication.id)
      expect(patientRepositorySpy).toHaveBeenCalledWith(mockMedication.patient)
      expect(actions[1]).toEqual(
        fetchMedicationSuccess({
          medication: mockMedication as Medication,
          patient: mockPatient as Patient,
        }),
      )
    })
  })

  describe('cancel medication', () => {
    const [mockMedication] = setup()
    let medicationRepositorySaveOrUpdateSpy: any

    beforeEach(() => {
      Date.now = jest.fn().mockReturnValue(new Date().valueOf())
      medicationRepositorySaveOrUpdateSpy = jest
        .spyOn(MedicationRepository, 'saveOrUpdate')
        .mockResolvedValue(mockMedication as Medication)
    })

    it('should cancel a medication', async () => {
      const expectedCanceledMedication = {
        ...mockMedication,
        canceledOn: new Date(Date.now()).toISOString(),
        status: 'canceled',
      } as Medication

      const store = mockStore()

      await store.dispatch(cancelMedication(mockMedication as Medication))
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
      await store.dispatch(cancelMedication(mockMedication as Medication, onSuccessSpy))

      expect(onSuccessSpy).toHaveBeenCalledWith(expectedCanceledMedication)
    })
  })

  describe('request medication', () => {
    const [mockMedication] = setup()
    let medicationRepositorySaveSpy: any

    beforeEach(() => {
      jest.restoreAllMocks()
      Date.now = jest.fn().mockReturnValue(new Date().valueOf())
      medicationRepositorySaveSpy = jest
        .spyOn(MedicationRepository, 'save')
        .mockResolvedValue(mockMedication as Medication)
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

      await store.dispatch(requestMedication(mockMedication as Medication))

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

      await store.dispatch(requestMedication(mockMedication as Medication, onSuccessSpy))

      expect(onSuccessSpy).toHaveBeenCalledWith(mockMedication)
    })
  })

  describe('update medication', () => {
    const [mockMedication] = setup()
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
