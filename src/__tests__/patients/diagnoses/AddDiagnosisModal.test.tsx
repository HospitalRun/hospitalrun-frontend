/* eslint-disable no-console */
import { Modal } from '@hospitalrun/components'
import { mount } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'

import AddDiagnosisModal from '../../../patients/diagnoses/AddDiagnosisModal'
import DiagnosisForm from '../../../patients/diagnoses/DiagnosisForm'
import PatientRepository from '../../../shared/db/PatientRepository'
import { CarePlanIntent, CarePlanStatus } from '../../../shared/model/CarePlan'
import Diagnosis, { DiagnosisStatus } from '../../../shared/model/Diagnosis'
import Patient from '../../../shared/model/Patient'

describe('Add Diagnosis Modal', () => {
  const mockDiagnosis: Diagnosis = {
    id: '123',
    name: 'some name',
    diagnosisDate: new Date().toISOString(),
    onsetDate: new Date().toISOString(),
    abatementDate: new Date().toISOString(),
    status: DiagnosisStatus.Active,
    visit: '1234',
    note: 'some note',
  }
  const mockPatient = {
    id: 'patientId',
    diagnoses: [mockDiagnosis],
    carePlans: [
      {
        id: '123',
        title: 'some title',
        description: 'some description',
        diagnosisId: '123',
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        status: CarePlanStatus.Active,
        intent: CarePlanIntent.Proposal,
      },
    ],
  } as Patient

  const setup = (patient = mockPatient, onCloseSpy = jest.fn()) => {
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(patient)
    jest.spyOn(PatientRepository, 'saveOrUpdate').mockResolvedValue(patient)

    const wrapper = mount(
      <AddDiagnosisModal patient={patient} show onCloseButtonClick={onCloseSpy} />,
    )

    wrapper.update()
    return { wrapper }
  }
  beforeEach(() => {
    console.error = jest.fn()
  })
  it('should render a modal', () => {
    const { wrapper } = setup()

    const modal = wrapper.find(Modal)

    expect(modal).toHaveLength(1)

    const successButton = modal.prop('successButton')
    const cancelButton = modal.prop('closeButton')
    expect(modal.prop('title')).toEqual('patient.diagnoses.new')
    expect(successButton?.children).toEqual('patient.diagnoses.new')
    expect(successButton?.icon).toEqual('add')
    expect(cancelButton?.children).toEqual('actions.cancel')
  })

  it('should render the diagnosis form', () => {
    const { wrapper } = setup()

    const diagnosisForm = wrapper.find(DiagnosisForm)
    expect(diagnosisForm).toHaveLength(1)
  })

  it('should dispatch add diagnosis when the save button is clicked', async () => {
    const patient = mockPatient
    patient.diagnoses = []
    const { wrapper } = setup(patient)

    const newDiagnosis = mockDiagnosis
    newDiagnosis.name = 'New Diagnosis Name'

    act(() => {
      const diagnosisForm = wrapper.find(DiagnosisForm)
      const onChange = diagnosisForm.prop('onChange') as any
      onChange(newDiagnosis)
    })
    wrapper.update()

    await act(async () => {
      const modal = wrapper.find(Modal)
      const onSave = (modal.prop('successButton') as any).onClick
      await onSave({} as React.MouseEvent<HTMLButtonElement>)
    })
    expect(PatientRepository.saveOrUpdate).toHaveBeenCalledTimes(1)
    expect(PatientRepository.saveOrUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        diagnoses: [expect.objectContaining({ name: 'New Diagnosis Name' })],
      }),
    )
  })

  it('should call the on close function when the cancel button is clicked', async () => {
    const onCloseButtonClickSpy = jest.fn()
    const { wrapper } = setup(mockPatient, onCloseButtonClickSpy)
    const modal = wrapper.find(Modal)
    act(() => {
      const { onClick } = modal.prop('closeButton') as any
      onClick()
    })
    expect(modal).toHaveLength(1)
    expect(onCloseButtonClickSpy).toHaveBeenCalledTimes(1)
  })
})
