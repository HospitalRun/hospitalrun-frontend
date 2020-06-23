import { Alert, Container, Panel } from '@hospitalrun/components'
import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'

import TextInputWithLabelFormGroup from '../components/input/TextInputWithLabelFormGroup'
import { remoteDb } from '../config/pouchdb'
import logo from '../images/logo-on-transparent.png'
import { RootState } from '../store'
import { getCurrentSession, login } from '../user/user-slice'

const Login = () => {
  const dispatch = useDispatch()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { loginError, user } = useSelector((root: RootState) => root.user)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      try {
        const session = await remoteDb.getSession()
        if (session.userCtx.name) {
          await dispatch(getCurrentSession(session.userCtx.name))
        }
      } catch (e) {
        console.log(e)
      }
      setLoading(false)
    }

    init()
  }, [dispatch])

  const onUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget
    setUsername(value)
  }

  const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget
    setPassword(value)
  }

  const onSignInClick = async () => {
    await dispatch(login(username, password))
  }

  if (loading) {
    return null
  }

  if (user) {
    return <Redirect to="/" />
  }

  return (
    <>
      <Container className="container align-items-center" style={{ width: '50%' }}>
        <img src={logo} alt="HospitalRun" style={{ width: '100%', textAlign: 'center' }} />
        <form>
          <Panel title="Please Sign In" color="primary">
            {loginError && <Alert color="danger" message={loginError} title="Unable to login" />}
            <TextInputWithLabelFormGroup
              isEditable
              label="username"
              name="username"
              value={username}
              onChange={onUsernameChange}
            />
            <TextInputWithLabelFormGroup
              isEditable
              type="password"
              label="password"
              name="password"
              value={password}
              onChange={onPasswordChange}
            />
            <Button block onClick={onSignInClick}>
              Sign In
            </Button>
          </Panel>
        </form>
      </Container>
    </>
  )
}

export default Login
