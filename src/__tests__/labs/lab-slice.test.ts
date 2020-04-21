import thunk from 'redux-thunk'
import createMockStore from 'redux-mock-store'
import PatientRepository from '../../clients/db/PatientRepository'
import LabRepository from '../../clients/db/LabRepository'
import Lab from '../../model/Lab'
import Patient from '../../model/Patient'
import labSlice, {
  requestLab,
  fetchLabStart,
  fetchLabSuccess,
  updateLabStart,
  updateLabSuccess,
  requestLabStart,
  requestLabSuccess,
  completeLabStart,
  completeLabSuccess,
  cancelLabStart,
  cancelLabSuccess,
  fetchLab,
  cancelLab,
  completeLab,
  completeLabError,
  requestLabError,
  updateLab,
} from '../../labs/lab-slice'
import { RootState } from '../../store'

const mockStore = createMockStore<RootState, any>([thunk])

describe('lab slice', () => {
  describe('reducers', () => {
    describe('fetchLabStart', () => {
      it('should set status to loading', async () => {
        const labStore = labSlice(undefined, fetchLabStart())

        expect(labStore.status).toEqual('loading')
      })
    })

    describe('fetchLabSuccess', () => {
      it('should set the lab, patient, and status to success', () => {
        const expectedLab = { id: 'labId' } as Lab
        const expectedPatient = { id: 'patientId' } as Patient

        const labStore = labSlice(
          undefined,
          fetchLabSuccess({ lab: expectedLab, patient: expectedPatient }),
        )

        expect(labStore.status).toEqual('success')
        expect(labStore.lab).toEqual(expectedLab)
        expect(labStore.patient).toEqual(expectedPatient)
      })
    })

    describe('updateLabStart', () => {
      it('should set status to loading', async () => {
        const labStore = labSlice(undefined, updateLabStart())

        expect(labStore.status).toEqual('loading')
      })
    })

    describe('updateLabSuccess', () => {
      it('should set the lab and status to success', () => {
        const expectedLab = { id: 'labId' } as Lab

        const labStore = labSlice(undefined, updateLabSuccess(expectedLab))

        expect(labStore.status).toEqual('success')
        expect(labStore.lab).toEqual(expectedLab)
      })
    })

    describe('requestLabStart', () => {
      it('should set status to loading', async () => {
        const labStore = labSlice(undefined, requestLabStart())

        expect(labStore.status).toEqual('loading')
      })
    })

    describe('requestLabSuccess', () => {
      it('should set the lab and status to success', () => {
        const expectedLab = { id: 'labId' } as Lab

        const labStore = labSlice(undefined, requestLabSuccess(expectedLab))

        expect(labStore.status).toEqual('success')
        expect(labStore.lab).toEqual(expectedLab)
      })
    })

    describe('requestLabError', () => {
      const expectedError = { message: 'some message', result: 'some result error' }

      const labStore = labSlice(undefined, requestLabError(expectedError))

      expect(labStore.status).toEqual('error')
      expect(labStore.error).toEqual(expectedError)
    })

    describe('completeLabStart', () => {
      it('should set status to loading', async () => {
        const labStore = labSlice(undefined, completeLabStart())

        expect(labStore.status).toEqual('loading')
      })
    })

    describe('completeLabSuccess', () => {
      it('should set the lab and status to success', () => {
        const expectedLab = { id: 'labId' } as Lab

        const labStore = labSlice(undefined, completeLabSuccess(expectedLab))

        expect(labStore.status).toEqual('success')
        expect(labStore.lab).toEqual(expectedLab)
      })
    })

    describe('completeLabError', () => {
      const expectedError = { message: 'some message', result: 'some result error' }

      const labStore = labSlice(undefined, completeLabError(expectedError))

      expect(labStore.status).toEqual('error')
      expect(labStore.error).toEqual(expectedError)
    })

    describe('cancelLabStart', () => {
      it('should set status to loading', async () => {
        const labStore = labSlice(undefined, cancelLabStart())

        expect(labStore.status).toEqual('loading')
      })
    })

    describe('cancelLabSuccess', () => {
      it('should set the lab and status to success', () => {
        const expectedLab = { id: 'labId' } as Lab

        const labStore = labSlice(undefined, cancelLabSuccess(expectedLab))

        expect(labStore.status).toEqual('success')
        expect(labStore.lab).toEqual(expectedLab)
      })
    })
  })

  describe('fetch lab', () => {
    let patientRepositorySpy: any
    let labRepositoryFindSpy: any

    const mockLab = {
      id: 'labId',
      patientId: 'patientId',
    } as Lab

    const mockPatient = {
      id: 'patientId',
    } as Patient

    beforeEach(() => {
      patientRepositorySpy = jest.spyOn(PatientRepository, 'find').mockResolvedValue(mockPatient)
      labRepositoryFindSpy = jest.spyOn(LabRepository, 'find').mockResolvedValue(mockLab)
    })

    it('should fetch the lab and patient', async () => {
      const store = mockStore()

      await store.dispatch(fetchLab(mockLab.id))
      const actions = store.getActions()

      expect(actions[0]).toEqual(fetchLabStart())
      expect(labRepositoryFindSpy).toHaveBeenCalledWith(mockLab.id)
      expect(patientRepositorySpy).toHaveBeenCalledWith(mockLab.patientId)
      expect(actions[1]).toEqual(fetchLabSuccess({ lab: mockLab, patient: mockPatient }))
    })
  })

  describe('cancel lab', () => {
    const mockLab = {
      id: 'labId',
      patientId: 'patientId',
    } as Lab
    let labRepositorySaveOrUpdateSpy: any

    beforeEach(() => {
      Date.now = jest.fn().mockReturnValue(new Date().valueOf())
      labRepositorySaveOrUpdateSpy = jest
        .spyOn(LabRepository, 'saveOrUpdate')
        .mockResolvedValue(mockLab)
    })

    it('should cancel a lab', async () => {
      const expectedCanceledLab = {
        ...mockLab,
        canceledOn: new Date(Date.now()).toISOString(),
        status: 'canceled',
      } as Lab

      const store = mockStore()

      await store.dispatch(cancelLab(mockLab))
      const actions = store.getActions()

      expect(actions[0]).toEqual(cancelLabStart())
      expect(labRepositorySaveOrUpdateSpy).toHaveBeenCalledWith(expectedCanceledLab)
      expect(actions[1]).toEqual(cancelLabSuccess(expectedCanceledLab))
    })

    it('should call on success callback if provided', async () => {
      const expectedCanceledLab = {
        ...mockLab,
        canceledOn: new Date(Date.now()).toISOString(),
        status: 'canceled',
      } as Lab

      const store = mockStore()
      const onSuccessSpy = jest.fn()
      await store.dispatch(cancelLab(mockLab, onSuccessSpy))

      expect(onSuccessSpy).toHaveBeenCalledWith(expectedCanceledLab)
    })
  })

  describe('complete lab', () => {
    const mockLab = {
      id: 'labId',
      patientId: 'patientId',
      result: 'lab result',
    } as Lab
    let labRepositorySaveOrUpdateSpy: any

    beforeEach(() => {
      Date.now = jest.fn().mockReturnValue(new Date().valueOf())
      labRepositorySaveOrUpdateSpy = jest
        .spyOn(LabRepository, 'saveOrUpdate')
        .mockResolvedValue(mockLab)
    })

    it('should complete a lab', async () => {
      const expectedCompletedLab = {
        ...mockLab,
        completedOn: new Date(Date.now()).toISOString(),
        status: 'completed',
        result: 'lab result',
      } as Lab

      const store = mockStore()

      await store.dispatch(completeLab(mockLab))
      const actions = store.getActions()

      expect(actions[0]).toEqual(completeLabStart())
      expect(labRepositorySaveOrUpdateSpy).toHaveBeenCalledWith(expectedCompletedLab)
      expect(actions[1]).toEqual(completeLabSuccess(expectedCompletedLab))
    })

    it('should call on success callback if provided', async () => {
      const expectedCompletedLab = {
        ...mockLab,
        completedOn: new Date(Date.now()).toISOString(),
        status: 'completed',
      } as Lab

      const store = mockStore()
      const onSuccessSpy = jest.fn()
      await store.dispatch(completeLab(mockLab, onSuccessSpy))

      expect(onSuccessSpy).toHaveBeenCalledWith(expectedCompletedLab)
    })

    it('should validate that the lab can be completed', async () => {
      const store = mockStore()
      const onSuccessSpy = jest.fn()
      await store.dispatch(completeLab({ id: 'labId' } as Lab, onSuccessSpy))
      const actions = store.getActions()

      expect(actions[1]).toEqual(
        completeLabError({
          result: 'labs.requests.error.resultRequiredToComplete',
          message: 'labs.requests.error.unableToComplete',
        }),
      )
      expect(onSuccessSpy).not.toHaveBeenCalled()
    })
  })

  describe('request lab', () => {
    const mockLab = {
      id: 'labId',
      type: 'labType',
      patientId: 'patientId',
    } as Lab
    let labRepositorySaveSpy: any

    beforeEach(() => {
      jest.restoreAllMocks()
      Date.now = jest.fn().mockReturnValue(new Date().valueOf())
      labRepositorySaveSpy = jest.spyOn(LabRepository, 'save').mockResolvedValue(mockLab)
    })

    it('should request a new lab', async () => {
      const store = mockStore()
      const expectedRequestedLab = {
        ...mockLab,
        requestedOn: new Date(Date.now()).toISOString(),
        status: 'requested',
      } as Lab

      await store.dispatch(requestLab(mockLab))

      const actions = store.getActions()

      expect(actions[0]).toEqual(requestLabStart())
      expect(labRepositorySaveSpy).toHaveBeenCalledWith(expectedRequestedLab)
      expect(actions[1]).toEqual(requestLabSuccess(expectedRequestedLab))
    })

    it('should execute the onSuccess callback if provided', async () => {
      const store = mockStore()
      const onSuccessSpy = jest.fn()

      await store.dispatch(requestLab(mockLab, onSuccessSpy))

      expect(onSuccessSpy).toHaveBeenCalledWith(mockLab)
    })

    it('should validate that the lab can be requested', async () => {
      const store = mockStore()
      const onSuccessSpy = jest.fn()
      await store.dispatch(requestLab({} as Lab, onSuccessSpy))

      const actions = store.getActions()

      expect(actions[0]).toEqual(requestLabStart())
      expect(actions[1]).toEqual(
        requestLabError({
          patient: 'labs.requests.error.patientRequired',
          type: 'labs.requests.error.typeRequired',
          message: 'labs.requests.error.unableToRequest',
        }),
      )
      expect(labRepositorySaveSpy).not.toHaveBeenCalled()
      expect(onSuccessSpy).not.toHaveBeenCalled()
    })
  })

  describe('update lab', () => {
    const mockLab = {
      id: 'labId',
      patientId: 'patientId',
      result: 'lab result',
    } as Lab
    let labRepositorySaveOrUpdateSpy: any

    const expectedUpdatedLab = {
      ...mockLab,
      type: 'some other type',
    }

    beforeEach(() => {
      Date.now = jest.fn().mockReturnValue(new Date().valueOf())
      labRepositorySaveOrUpdateSpy = jest
        .spyOn(LabRepository, 'saveOrUpdate')
        .mockResolvedValue(expectedUpdatedLab)
    })

    it('should update the lab', async () => {
      const store = mockStore()

      await store.dispatch(updateLab(expectedUpdatedLab))
      const actions = store.getActions()

      expect(actions[0]).toEqual(updateLabStart())
      expect(labRepositorySaveOrUpdateSpy).toHaveBeenCalledWith(expectedUpdatedLab)
      expect(actions[1]).toEqual(updateLabSuccess(expectedUpdatedLab))
    })

    it('should call the onSuccess callback if successful', async () => {
      const store = mockStore()
      const onSuccessSpy = jest.fn()

      await store.dispatch(updateLab(expectedUpdatedLab, onSuccessSpy))

      expect(onSuccessSpy).toHaveBeenCalledWith(expectedUpdatedLab)
    })
  })
})
