import { Spinner } from '@hospitalrun/components'
import React, { Suspense } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import HospitalRun from './HospitalRun'
import Login from './login/Login'
import store from './store'

const App: React.FC = () => (
  <div>
    <Provider store={store}>
      <BrowserRouter>
        <Suspense fallback={<Spinner color="blue" loading size={[10, 25]} type="ScaleLoader" />}>
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route path="/" component={HospitalRun} />
          </Switch>
        </Suspense>
      </BrowserRouter>
    </Provider>
  </div>
)

export default App
