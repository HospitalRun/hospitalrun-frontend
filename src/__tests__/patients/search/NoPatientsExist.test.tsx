import { render, screen } from '@testing-library/react'
import React from 'react'

import NoPatientsExist from '../../../patients/search/NoPatientsExist'

describe('NoPatientsExist', () => {
  it('should render an icon and a button with typography', () => {
    render(<NoPatientsExist />)

    expect(
      screen.getByRole('heading', {
        name: /patients\.nopatients/i,
      }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', {
        name: /patients\.newpatient/i,
      }),
    ).toBeInTheDocument()
  })
})
