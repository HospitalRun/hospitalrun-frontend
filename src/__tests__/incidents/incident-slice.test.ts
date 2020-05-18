import { addDays } from 'date-fns'
import { AnyAction } from 'redux'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import shortid from 'shortid'

import IncidentRepository from '../../clients/db/IncidentRepository'
import incident, {
  reportIncidentStart,
  reportIncidentSuccess,
  reportIncidentError,
  reportIncident,
  fetchIncidentStart,
  fetchIncidentSuccess,
  fetchIncident,
} from '../../incidents/incident-slice'
import Incident from '../../model/Incident'
import Permissions from '../../model/Permissions'
import User from '../../model/User'
import { RootState } from '../../store'

const mockStore = createMockStore<RootState, any>([thunk])

describe('incident slice', () => {
  describe('actions', () => {
    it('should default the store correctly', () => {
      const incidentStore = incident(undefined, {} as AnyAction)
      expect(incidentStore.status).toEqual('loading')
      expect(incidentStore.incident).toBeUndefined()
      expect(incidentStore.error).toBeUndefined()
    })

    it('should handle the report incident start', () => {
      const incidentStore = incident(undefined, reportIncidentStart)
      expect(incidentStore.status).toEqual('loading')
    })

    it('should handle the report incident success', () => {
      const expectedIncident = {
        id: 'some id',
        reportedOn: new Date().toISOString(),
        reportedBy: 'some user id',
        description: 'description',
        date: new Date().toISOString(),
        department: 'some department',
        category: 'category',
        categoryItem: 'categoryItem',
        code: 'some code',
      } as Incident

      const incidentStore = incident(undefined, reportIncidentSuccess(expectedIncident))
      expect(incidentStore.status).toEqual('completed')
      expect(incidentStore.incident).toEqual(expectedIncident)
      expect(incidentStore.error).toBeUndefined()
    })

    it('should handle the report incident error', () => {
      const expectedError = {
        date: 'some description error',
        description: 'some description error',
      }

      const incidentStore = incident(undefined, reportIncidentError(expectedError))
      expect(incidentStore.status).toEqual('error')
      expect(incidentStore.error).toEqual(expectedError)
    })

    it('should handle fetch incident start', () => {
      const incidentStore = incident(undefined, fetchIncidentStart())
      expect(incidentStore.status).toEqual('loading')
    })

    it('should handle fetch incident success', () => {
      const expectedIncident = {
        id: '1234',
        code: 'some code',
      } as Incident

      const incidentStore = incident(undefined, fetchIncidentSuccess(expectedIncident))
      expect(incidentStore.status).toEqual('completed')
      expect(incidentStore.incident).toEqual(expectedIncident)
    })
  })

  describe('report incident', () => {
    beforeEach(() => {
      jest.restoreAllMocks()
    })

    it('should successfully create an incident', async () => {
      const expectedDate = new Date()
      const expectedShortId = '123456'
      Date.now = jest.fn().mockReturnValue(expectedDate)
      jest.spyOn(shortid, 'generate').mockReturnValue(expectedShortId)
      const onSuccessSpy = jest.fn()
      const newIncident = {
        description: 'description',
        date: expectedDate.toISOString(),
        department: 'some department',
        category: 'category',
        categoryItem: 'categoryItem',
      } as Incident

      const expectedIncident = {
        ...newIncident,
        code: `I-${expectedShortId}`,
        reportedOn: expectedDate.toISOString(),
        reportedBy: 'some user id',
        status: 'reported',
      } as Incident

      jest.spyOn(IncidentRepository, 'save').mockResolvedValue(expectedIncident)

      const store = mockStore({
        user: {
          user: { id: expectedIncident.reportedBy } as User,
          permissions: [] as Permissions[],
        },
      } as any)

      await store.dispatch(reportIncident(newIncident, onSuccessSpy))

      expect(store.getActions()[0]).toEqual(reportIncidentStart())
      expect(store.getActions()[1]).toEqual(reportIncidentSuccess(expectedIncident))
      expect(IncidentRepository.save).toHaveBeenCalledWith(expectedIncident)
      expect(onSuccessSpy).toHaveBeenLastCalledWith(expectedIncident)
    })

    it('should validate the required fields apart of an incident', async () => {
      const onSuccessSpy = jest.fn()
      const newIncident = {} as Incident
      jest.spyOn(IncidentRepository, 'save')
      const expectedError = {
        date: 'incidents.reports.error.dateRequired',
        department: 'incidents.reports.error.departmentRequired',
        category: 'incidents.reports.error.categoryRequired',
        categoryItem: 'incidents.reports.error.categoryItemRequired',
        description: 'incidents.reports.error.descriptionRequired',
      }

      const store = mockStore({
        user: {
          user: { id: 'some id' } as User,
          permissions: [] as Permissions[],
        },
      } as any)
      await store.dispatch(reportIncident(newIncident, onSuccessSpy))

      expect(store.getActions()[0]).toEqual(reportIncidentStart())
      expect(store.getActions()[1]).toEqual(reportIncidentError(expectedError))
      expect(IncidentRepository.save).not.toHaveBeenCalled()
      expect(onSuccessSpy).not.toHaveBeenCalled()
    })

    it('should validate that the incident date is not a date in the future', async () => {
      const onSuccessSpy = jest.fn()
      const newIncident = {
        description: 'description',
        date: addDays(new Date(), 4).toISOString(),
        department: 'some department',
        category: 'category',
        categoryItem: 'categoryItem',
      } as Incident
      jest.spyOn(IncidentRepository, 'save')
      const expectedError = {
        date: 'incidents.reports.error.dateMustBeInThePast',
      }

      const store = mockStore({
        user: {
          user: { id: 'some id' } as User,
          permissions: [] as Permissions[],
        },
      } as any)
      await store.dispatch(reportIncident(newIncident, onSuccessSpy))

      expect(store.getActions()[0]).toEqual(reportIncidentStart())
      expect(store.getActions()[1]).toEqual(reportIncidentError(expectedError))
      expect(IncidentRepository.save).not.toHaveBeenCalled()
      expect(onSuccessSpy).not.toHaveBeenCalled()
    })
  })

  describe('fetch incident', () => {
    it('should fetch the incident', async () => {
      const expectedIncident = {
        id: '123',
        description: 'description',
        date: addDays(new Date(), 4).toISOString(),
        department: 'some department',
        category: 'category',
        categoryItem: 'categoryItem',
      } as Incident
      jest.spyOn(IncidentRepository, 'find').mockResolvedValue(expectedIncident)

      const store = mockStore()

      await store.dispatch(fetchIncident(expectedIncident.id))

      expect(store.getActions()[0]).toEqual(fetchIncidentStart())
      expect(IncidentRepository.find).toHaveBeenCalledWith(expectedIncident.id)
      expect(store.getActions()[1]).toEqual(fetchIncidentSuccess(expectedIncident))
    })
  })
})
