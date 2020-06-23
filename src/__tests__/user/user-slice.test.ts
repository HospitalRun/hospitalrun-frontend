import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { remoteDb } from '../../config/pouchdb'
import Permissions from '../../model/Permissions'
import { RootState } from '../../store'
import user, {
  fetchPermissions,
  getCurrentSession,
  login,
  loginSuccess,
  loginError,
  logout,
  logoutSuccess,
} from '../../user/user-slice'

const mockStore = configureMockStore<RootState, any>([thunk])

describe('user slice', () => {
  describe('reducers', () => {
    it('should handle the FETCH_PERMISSIONS action', () => {
      const expectedPermissions = [Permissions.ReadPatients, Permissions.WritePatients]
      const userStore = user(undefined, {
        type: fetchPermissions.type,
        payload: expectedPermissions,
      })

      expect(userStore.permissions).toEqual(expectedPermissions)
    })

    it('should handle the LOGIN_SUCCESS action', () => {
      const expectedUser = {
        familyName: 'firstName',
        givenName: 'lastName',
        id: 'id',
      }
      const expectedPermissions = [Permissions.WritePatients]
      const userStore = user(undefined, {
        type: loginSuccess.type,
        payload: { user: expectedUser, permissions: expectedPermissions },
      })

      expect(userStore.user).toEqual(expectedUser)
    })

    it('should handle the login error', () => {
      const expectedError = 'error'
      const userStore = user(undefined, {
        type: loginError.type,
        payload: expectedError,
      })

      expect(userStore.loginError).toEqual(expectedError)
    })

    it('should handle the logout success', () => {
      const userStore = user(
        { user: { givenName: 'given', familyName: 'family', id: 'id' }, permissions: [] },
        {
          type: logoutSuccess.type,
        },
      )

      expect(userStore.user).toEqual(undefined)
      expect(userStore.permissions).toEqual([])
    })
  })

  describe('login', () => {
    beforeEach(() => {
      jest.resetAllMocks()
    })

    it('should login with the username and password', async () => {
      jest.spyOn(remoteDb, 'logIn').mockResolvedValue({ name: 'test', ok: true })
      jest.spyOn(remoteDb, 'getUser').mockResolvedValue({
        _id: 'userId',
        metadata: {
          givenName: 'test',
          familyName: 'user',
        },
      } as any)
      const store = mockStore()
      const expectedUsername = 'test'
      const expectedPassword = 'password'

      await store.dispatch(login(expectedUsername, expectedPassword))

      expect(remoteDb.logIn).toHaveBeenCalledTimes(1)
      expect(remoteDb.logIn).toHaveBeenLastCalledWith(expectedUsername, expectedPassword)
      expect(remoteDb.getUser).toHaveBeenCalledWith(expectedUsername)
      expect(store.getActions()[0]).toEqual({
        type: loginSuccess.type,
        payload: expect.objectContaining({
          user: { familyName: 'user', givenName: 'test', id: 'userId' },
        }),
      })
    })

    it('should dispatch login error if login was not successful', async () => {
      jest.spyOn(remoteDb, 'logIn').mockRejectedValue({ status: '401' })
      jest.spyOn(remoteDb, 'getUser').mockResolvedValue({
        _id: 'userId',
        metadata: {
          givenName: 'test',
          familyName: 'user',
        },
      } as any)
      const store = mockStore()

      await store.dispatch(login('user', 'password'))

      expect(remoteDb.getUser).not.toHaveBeenCalled()
      expect(store.getActions()[0]).toEqual({
        type: loginError.type,
        payload: 'user.login.error',
      })
    })
  })

  describe('logout', () => {
    beforeEach(() => {
      jest.resetAllMocks()
    })

    it('should logout the user', async () => {
      jest.spyOn(remoteDb, 'logOut').mockImplementation(jest.fn())
      const store = mockStore()

      await store.dispatch(logout())

      expect(remoteDb.logOut).toHaveBeenCalledTimes(1)
      expect(store.getActions()[0]).toEqual({ type: logoutSuccess.type })
    })
  })

  describe('getCurrentSession', () => {
    it('should get the detail of the current user and update the store', async () => {
      jest.spyOn(remoteDb, 'getUser').mockResolvedValue({
        _id: 'userId',
        metadata: {
          givenName: 'test',
          familyName: 'user',
        },
      } as any)
      const store = mockStore()
      const expectedUsername = 'test'

      await store.dispatch(getCurrentSession(expectedUsername))

      expect(remoteDb.getUser).toHaveBeenCalledWith(expectedUsername)
      expect(store.getActions()[0]).toEqual({
        type: loginSuccess.type,
        payload: expect.objectContaining({
          user: { familyName: 'user', givenName: 'test', id: 'userId' },
        }),
      })
    })
  })
})
