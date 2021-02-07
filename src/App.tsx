/* eslint-disable no-console */

import { Spinner } from '@hospitalrun/components'
import React, { Suspense, useEffect, useState } from 'react'
import { ReactQueryDevtools } from 'react-query-devtools'
import { useDispatch } from 'react-redux'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import HospitalRun from './HospitalRun'
import { TitleProvider } from './page-header/title/TitleContext'
import { remoteDb } from './shared/config/pouchdb'
import { getCurrentSession } from './user/user-slice'

const App: React.FC = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    remoteDb
      .getSession()
      .then((session) => {
        if (cancelled) {
          return
        }
        if (session.userCtx.name) {
          dispatch(getCurrentSession(session.userCtx.name))
        }
      })
      .catch((e) => {
        console.log(e)
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [dispatch])

  if (loading) {
    return null
  }

  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<Spinner color="blue" loading size={[10, 25]} type="ScaleLoader" />}>
          <Switch>
            <TitleProvider>
              <Route path="/" component={HospitalRun} />
            </TitleProvider>
          </Switch>
        </Suspense>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  )
}

export default App
