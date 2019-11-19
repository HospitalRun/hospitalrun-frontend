import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import HospitalRun from './containers/HospitalRun'

import store from './store/store'

const App: React.FC = () => (
  <div>
    <Provider store={store}>
      <BrowserRouter>
        <HospitalRun />
      </BrowserRouter>
    </Provider>
  </div>
)

export default App
