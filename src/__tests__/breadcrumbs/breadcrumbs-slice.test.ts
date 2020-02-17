import '../../__mocks__/matchMediaMock'
import { AnyAction } from 'redux'
import breadcrumbs, { addBreadcrumbs, removeBreadcrumbs } from '../../breadcrumbs/breadcrumbs-slice'

describe('breadcrumbs slice', () => {
  describe('breadcrumbs reducer', () => {
    it('should create the proper initial state with empty patients array', () => {
      const breadcrumbsStore = breadcrumbs(undefined, {} as AnyAction)

      expect(breadcrumbsStore.breadcrumbs).toEqual([])
    })

    it('should handle the ADD_BREADCRUMBS action', () => {
      const breadcrumbsToAdd = [
        { text: 'user', location: '/user' },
        { text: 'Bob', location: '/user/1' },
      ]

      const breadcrumbsStore = breadcrumbs(undefined, {
        type: addBreadcrumbs.type,
        payload: breadcrumbsToAdd,
      })

      expect(breadcrumbsStore.breadcrumbs).toEqual(breadcrumbsToAdd)
    })

    it('should handle the ADD_BREADCRUMBS action with existing breadcrumbs', () => {
      const breadcrumbsToAdd = [{ text: 'Bob', location: '/user/1' }]

      const state = {
        breadcrumbs: [{ text: 'user', location: '/user' }],
      }

      const breadcrumbsStore = breadcrumbs(state, {
        type: addBreadcrumbs.type,
        payload: breadcrumbsToAdd,
      })

      expect(breadcrumbsStore.breadcrumbs).toEqual([...state.breadcrumbs, ...breadcrumbsToAdd])
    })

    it('should handle the ADD_BREADCRUMBS action and sort the breadcrumbs by their location', () => {
      const breadcrumbsToAdd = [{ text: 'Bob', location: '/user/1/' }]

      const state = {
        breadcrumbs: [
          { text: 'user', location: '/user' },
          { text: 'edit user', location: '/user/1/edit' },
        ],
      }

      const breadcrumbsStore = breadcrumbs(state, {
        type: addBreadcrumbs.type,
        payload: breadcrumbsToAdd,
      })

      expect(breadcrumbsStore.breadcrumbs).toEqual([
        { text: 'user', location: '/user' },
        { text: 'Bob', location: '/user/1/' },
        { text: 'edit user', location: '/user/1/edit' },
      ])
    })

    it('should handle the REMOVE_BREADCRUMBS action', () => {
      const breadcrumbsToRemove = [{ text: 'Bob', location: '/user/1' }]

      const state = {
        breadcrumbs: [
          { text: 'user', location: '/user' },
          { text: 'Bob', location: '/user/1' },
        ],
      }

      const breadcrumbsStore = breadcrumbs(state, {
        type: removeBreadcrumbs.type,
        payload: breadcrumbsToRemove,
      })

      expect(breadcrumbsStore.breadcrumbs).toEqual([{ text: 'user', location: '/user' }])
    })
  })
})
