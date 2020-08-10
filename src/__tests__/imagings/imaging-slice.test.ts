import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import imagingSlice, {
  requestImaging,
  requestImagingStart,
  requestImagingSuccess,
  requestImagingError,
} from '../../imagings/imaging-slice'
import ImagingRepository from '../../shared/db/ImagingRepository'
import Imaging from '../../shared/model/Imaging'
import { RootState } from '../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])

describe('imaging slice', () => {
  describe('reducers', () => {
    describe('requestImagingStart', () => {
      it('should set status to loading', async () => {
        const imagingStore = imagingSlice(undefined, requestImagingStart())

        expect(imagingStore.status).toEqual('loading')
      })
    })

    describe('requestImagingSuccess', () => {
      it('should set the imaging and status to success', () => {
        const expectedImaging = { id: 'imagingId' } as Imaging

        const imagingStore = imagingSlice(undefined, requestImagingSuccess(expectedImaging))

        expect(imagingStore.status).toEqual('completed')
        expect(imagingStore.imaging).toEqual(expectedImaging)
      })
    })

    describe('requestImagingError', () => {
      const expectedError = { message: 'some message', result: 'some result error' }

      const imagingStore = imagingSlice(undefined, requestImagingError(expectedError))

      expect(imagingStore.status).toEqual('error')
      expect(imagingStore.error).toEqual(expectedError)
    })

    describe('request imaging', () => {
      const mockImaging = {
        id: 'imagingId',
        type: 'imagingType',
        patient: 'patient',
        status: 'requested',
      } as Imaging
      let imagingRepositorySaveSpy: any

      beforeEach(() => {
        jest.restoreAllMocks()
        Date.now = jest.fn().mockReturnValue(new Date().valueOf())
        imagingRepositorySaveSpy = jest
          .spyOn(ImagingRepository, 'save')
          .mockResolvedValue(mockImaging)
      })

      it('should request a new imaging', async () => {
        const store = mockStore({
          user: {
            user: {
              id: '1234',
            },
          },
        } as any)

        const expectedRequestedImaging = {
          ...mockImaging,
          requestedOn: new Date(Date.now()).toISOString(),
          requestedBy: store.getState().user.user.id,
        } as Imaging

        await store.dispatch(requestImaging(mockImaging))

        const actions = store.getActions()

        expect(actions[0]).toEqual(requestImagingStart())
        expect(imagingRepositorySaveSpy).toHaveBeenCalledWith(expectedRequestedImaging)
        expect(actions[1]).toEqual(requestImagingSuccess(expectedRequestedImaging))
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

        await store.dispatch(requestImaging(mockImaging, onSuccessSpy))
        expect(onSuccessSpy).toHaveBeenCalledWith(mockImaging)
      })

      it('should validate that the imaging can be requested', async () => {
        const store = mockStore()
        const onSuccessSpy = jest.fn()
        await store.dispatch(requestImaging({} as Imaging, onSuccessSpy))

        const actions = store.getActions()

        expect(actions[0]).toEqual(requestImagingStart())
        expect(actions[1]).toEqual(
          requestImagingError({
            patient: 'imagings.requests.error.patientRequired',
            type: 'imagings.requests.error.typeRequired',
            status: 'imagings.requests.error.statusRequired',
            message: 'imagings.requests.error.unableToRequest',
          }),
        )
        expect(imagingRepositorySaveSpy).not.toHaveBeenCalled()
        expect(onSuccessSpy).not.toHaveBeenCalled()
      })
    })
  })
})
