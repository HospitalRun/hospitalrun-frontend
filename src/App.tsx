import { Spinner } from '@hospitalrun/components'
import React, { Suspense } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import HospitalRun from './HospitalRun'
import store from './store'

const App: React.FC = () => (
  <div>
    <Provider store={store}>
      <Suspense fallback={<Spinner color="blue" loading size={[10, 25]} type="ScaleLoader" />}>
        <BrowserRouter>
          <HospitalRun />
        </BrowserRouter>
      </Suspense>
    </Provider>
  </div>
)

export default App
