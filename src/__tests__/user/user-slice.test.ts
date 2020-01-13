import user, { fetchPermissions } from '../../user/user-slice'
import Permissions from '../../model/Permissions'

describe('user slice', () => {
  it('should handle the FETCH_PERMISSIONS action', () => {
    const expectedPermissions = [Permissions.ReadPatients, Permissions.WritePatients]
    const userStore = user(undefined, {
      type: fetchPermissions.type,
      payload: expectedPermissions,
    })

    expect(userStore.permissions).toEqual(expectedPermissions)
  })
})
