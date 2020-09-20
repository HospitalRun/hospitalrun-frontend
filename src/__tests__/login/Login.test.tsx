import { Alert } from '@hospitalrun/components'
import { mount, ReactWrapper } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import Button from 'react-bootstrap/Button'
import { act } from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { Router } from 'react-router'
import createMockStore, { MockStore } from 'redux-mock-store'
import thunk from 'redux-thunk'

import Login from '../../login/Login'
import TextInputWithLabelFormGroup from '../../shared/components/input/TextInputWithLabelFormGroup'
import { remoteDb } from '../../shared/config/pouchdb'
import User from '../../shared/model/User'
import { RootState } from '../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])

describe('Login', () => {
  const history = createMemoryHistory()
  let store: MockStore

  const setup = (storeValue: any = { loginError: {}, user: {} as User }) => {
    history.push('/login')
    store = mockStore(storeValue)

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <Login />
        </Router>
      </Provider>,
    )

    wrapper.update()
    return wrapper
  }

  describe('Layout initial validations', () => {
    it('should render a login form', async () => {
      let wrapper: any

      await act(async () => {
        wrapper = await setup()
      })

      const form = wrapper.find('form')
      expect(form).toHaveLength(1)
    })

    it('should render a username and password input', async () => {
      let wrapper: any

      await act(async () => {
        wrapper = setup()
      })

      const user = wrapper.find(TextInputWithLabelFormGroup)
      expect(user).toHaveLength(2)
    })

    it('should render a submit button', async () => {
      let wrapper: any
      await act(async () => {
        wrapper = setup()
      })

      const button = wrapper.find(Button)
      expect(button).toHaveLength(1)
    })
  })

  describe('Unable to login', () => {
    it('should get field required error message if no username is provided', async () => {
      let wrapper: any

      await act(async () => {
        wrapper = await setup()
      })

      jest.spyOn(remoteDb, 'logIn')

      const password = wrapper.find('#passwordTextInput').at(0)
      await act(async () => {
        const onChange = password.prop('onChange') as any
        await onChange({ currentTarget: { value: 'password' } })
      })

      wrapper.update()

      const saveButton = wrapper.find({ type: 'submit' }).at(0)

      await act(async () => {
        const onClick = saveButton.prop('onClick') as any
        await onClick({ preventDefault: jest.fn() })
      })

      wrapper.update()

      expect(remoteDb.logIn).toHaveBeenCalledWith('', 'password')
      expect(history.location.pathname).toEqual('/login')
      expect(store.getActions()).toContainEqual({
        type: 'user/loginError',
        payload: {
          message: 'user.login.error.message.required',
          username: 'user.login.error.username.required',
          password: 'user.login.error.password.required',
        },
      })
    })

    it('should show required username error message', async () => {
      let wrapper: any

      await act(async () => {
        wrapper = await setup({
          user: {
            loginError: {
              message: 'user.login.error.message.required',
              username: 'user.login.error.username.required',
              password: 'user.login.error.password.required',
            },
          },
        } as any)
      })

      let password: ReactWrapper = wrapper.find('#passwordTextInput').at(0)
      await act(async () => {
        const onChange = password.prop('onChange') as any
        await onChange({ currentTarget: { value: 'password' } })
      })

      wrapper.update()

      const alert = wrapper.find(Alert)
      const username = wrapper.find('#usernameTextInput')
      password = wrapper.find('#passwordTextInput')

      const usernameFeedback = username.find('Feedback')
      const passwordFeedback = password.find('Feedback')

      expect(alert.prop('message')).toEqual('user.login.error.message.required')
      expect(usernameFeedback.hasClass('undefined')).not.toBeTruthy()
      expect(passwordFeedback.hasClass('undefined')).toBeTruthy()
    })

    it('should get field required error message if no password is provided', async () => {
      let wrapper: any

      await act(async () => {
        wrapper = await setup()
      })

      jest.spyOn(remoteDb, 'logIn')

      const username = wrapper.find('#usernameTextInput').at(0)
      await act(async () => {
        const onChange = username.prop('onChange') as any
        await onChange({ currentTarget: { value: 'username' } })
      })

      wrapper.update()

      const saveButton = wrapper.find({ type: 'submit' }).at(0)

      await act(async () => {
        const onClick = saveButton.prop('onClick') as any
        await onClick({ preventDefault: jest.fn() })
      })

      wrapper.update()

      expect(remoteDb.logIn).toHaveBeenCalledWith('username', '')
      expect(history.location.pathname).toEqual('/login')
      expect(store.getActions()).toContainEqual({
        type: 'user/loginError',
        payload: {
          message: 'user.login.error.message.required',
          username: 'user.login.error.username.required',
          password: 'user.login.error.password.required',
        },
      })
    })

    it('should show required password error message', async () => {
      let wrapper: any

      await act(async () => {
        wrapper = await setup({
          user: {
            loginError: {
              message: 'user.login.error.message.required',
              username: 'user.login.error.username.required',
              password: 'user.login.error.password.required',
            },
          },
        } as any)
      })

      let username: ReactWrapper = wrapper.find('#usernameTextInput').at(0)
      await act(async () => {
        const onChange = username.prop('onChange') as any
        await onChange({ currentTarget: { value: 'username' } })
      })

      wrapper.update()

      const alert = wrapper.find(Alert)
      const password = wrapper.find('#passwordTextInput').at(0)
      username = wrapper.find('#usernameTextInput').at(0)

      const passwordFeedback = password.find('Feedback')
      const usernameFeedback = username.find('Feedback')

      expect(alert.prop('message')).toEqual('user.login.error.message.required')
      expect(passwordFeedback.hasClass('undefined')).not.toBeTruthy()
      expect(usernameFeedback.hasClass('undefined')).toBeTruthy()
    })

    it('should get incorrect username or password error when incorrect username or password is provided', async () => {
      let wrapper: any

      await act(async () => {
        wrapper = await setup()
      })

      jest.spyOn(remoteDb, 'logIn').mockRejectedValue({ status: 401 })

      const username = wrapper.find('#usernameTextInput').at(0)
      await act(async () => {
        const onChange = username.prop('onChange') as any
        await onChange({ currentTarget: { value: 'username' } })
      })

      const password = wrapper.find('#passwordTextInput').at(0)
      await act(async () => {
        const onChange = password.prop('onChange') as any
        await onChange({ currentTarget: { value: 'password' } })
      })

      wrapper.update()

      const saveButton = wrapper.find({ type: 'submit' }).at(0)
      await act(async () => {
        const onClick = saveButton.prop('onClick') as any
        await onClick({ preventDefault: jest.fn() })
      })

      wrapper.update()

      expect(remoteDb.logIn).toHaveBeenCalledWith('username', 'password')
      expect(history.location.pathname).toEqual('/login')
      expect(store.getActions()).toContainEqual({
        type: 'user/loginError',
        payload: {
          message: 'user.login.error.message.incorrect',
        },
      })
    })
  })

  describe('Sucessfully login', () => {
    it('should log in if username and password is correct', async () => {
      let wrapper: any

      await act(async () => {
        wrapper = await setup()
      })

      jest.spyOn(remoteDb, 'logIn').mockResolvedValue({
        name: 'username',
        ok: true,
        roles: [],
      })

      jest.spyOn(remoteDb, 'getUser').mockResolvedValue({
        _id: 'userId',
        metadata: {
          givenName: 'test',
          familyName: 'user',
        },
      } as any)

      const username = wrapper.find('#usernameTextInput').at(0)
      await act(async () => {
        const onChange = username.prop('onChange') as any
        await onChange({ currentTarget: { value: 'username' } })
      })

      const password = wrapper.find('#passwordTextInput').at(0)
      await act(async () => {
        const onChange = password.prop('onChange') as any
        await onChange({ currentTarget: { value: 'password' } })
      })

      const saveButton = wrapper.find({ type: 'submit' }).at(0)

      await act(async () => {
        const onClick = saveButton.prop('onClick') as any
        await onClick({ preventDefault: jest.fn() })
      })

      wrapper.update()

      expect(store.getActions()[0].payload.user).toEqual({
        id: 'userId',
        givenName: 'test',
        familyName: 'user',
      })
      expect(store.getActions()[0].type).toEqual('user/loginSuccess')
    })
  })
})
