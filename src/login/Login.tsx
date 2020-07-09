import { Alert, Container, Panel } from '@hospitalrun/components'
import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'

import TextInputWithLabelFormGroup from '../shared/components/input/TextInputWithLabelFormGroup'
import { remoteDb } from '../shared/config/pouchdb'
import useTranslator from '../shared/hooks/useTranslator'
import logo from '../shared/static/images/logo-on-transparent.png'
import { RootState } from '../shared/store'
import { getCurrentSession, login } from '../user/user-slice'

const Login = () => {
  const dispatch = useDispatch()
  const { t } = useTranslator()
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
            {loginError?.message && (
              <Alert color="danger" message={t(loginError?.message)} title="Unable to login" />
            )}
            <TextInputWithLabelFormGroup
              isEditable
              label="username"
              name="username"
              value={username}
              onChange={onUsernameChange}
              isRequired
              isInvalid={!!loginError?.username && !username}
              feedback={t(loginError?.username)}
            />
            <TextInputWithLabelFormGroup
              isEditable
              type="password"
              label="password"
              name="password"
              value={password}
              onChange={onPasswordChange}
              isRequired
              isInvalid={!!loginError?.password && !password}
              feedback={t(loginError?.password)}
            />
            <Button type="submit" block onClick={onSignInClick}>
              Sign In
            </Button>
          </Panel>
        </form>
      </Container>
    </>
  )
}

export default Login
