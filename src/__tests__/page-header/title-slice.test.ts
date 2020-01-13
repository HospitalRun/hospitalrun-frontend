import { AnyAction } from 'redux'
import title, { updateTitle, changeTitle } from '../../page-header/title-slice'

describe('title slice', () => {
  describe('title reducer', () => {
    it('should create the proper initial title reducer', () => {
      const patientsStore = title(undefined, {} as AnyAction)
      expect(patientsStore.title).toEqual('')
    })
  })

  it('should handle the CHANGE_TITLE action', () => {
    const expectedTitle = 'expected title'
    const patientsStore = title(undefined, {
      type: changeTitle.type,
      payload: expectedTitle,
    })

    expect(patientsStore.title).toEqual(expectedTitle)
  })

  describe('updateTitle', () => {
    it('should dispatch the CHANGE_TITLE event', async () => {
      const dispatch = jest.fn()
      const getState = jest.fn()
      const expectedTitle = 'expected title'

      await updateTitle(expectedTitle)(dispatch, getState, null)

      expect(dispatch).toHaveBeenCalledWith({ type: changeTitle.type, payload: expectedTitle })
    })
  })
})
