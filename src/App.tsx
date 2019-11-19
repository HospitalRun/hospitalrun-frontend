import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import HospitalRun from './containers/HospitalRun'

const App: React.FC = () => (
  <div>
    <BrowserRouter>
      <HospitalRun />
    </BrowserRouter>
  </div>
)

export default App
