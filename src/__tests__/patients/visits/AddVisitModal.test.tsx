import { screen, render as rtlRender } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import React, { ReactNode } from 'react'
import { Router } from 'react-router-dom'

import AddVisitModal from '../../../patients/visits/AddVisitModal'
import PatientRepository from '../../../shared/db/PatientRepository'
import Patient from '../../../shared/model/Patient'
import { VisitStatus } from '../../../shared/model/Visit'

type WrapperProps = {
  // eslint-disable-next-line react/require-default-props
  children?: ReactNode
}

describe('Add Visit Modal', () => {
  const patient = {
    id: 'patientId',
    visits: [
      {
        id: '123',
        startDateTime: new Date().toISOString(),
        endDateTime: new Date().toISOString(),
        type: 'standard type',
        status: VisitStatus.Arrived,
        reason: 'routine',
        location: 'main',
      },
    ],
  } as Patient

  const onCloseSpy = jest.fn()
  const render = () => {
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(patient)
    jest.spyOn(PatientRepository, 'saveOrUpdate')
    const history = createMemoryHistory()

    function Wrapper({ children }: WrapperProps) {
      return <Router history={history}>{children}</Router>
    }

    const results = rtlRender(
      <AddVisitModal show onCloseButtonClick={onCloseSpy} patientId={patient.id} />,
      {
        wrapper: Wrapper,
      },
    )

    return results
  }

  it('should render a modal and within a form', () => {
    render()

    expect(screen.getByRole('dialog').querySelector('form')).toBeInTheDocument()
  })

  it('should call the on close function when the cancel button is clicked', () => {
    render()
    userEvent.click(
      screen.getByRole('button', {
        name: /close/i,
      }),
    )
    expect(onCloseSpy).toHaveBeenCalledTimes(1)
  })

  /*   it('should save the visit when the save button is clicked', () => {
    const { container } = render()
    const firstPatient = patient.visits[0]
    userEvent.type(container.querySelector('.react-datepicker-wrapper.form-control ', firstPatient.))
    screen.debug(undefined, Infinity)
    // expect(PatientRepository.saveOrUpdate).toHaveBeenCalledTimes(1)
    // expect(PatientRepository.saveOrUpdate).toHaveBeenCalledWith(patient)
  }) */
})
