import '../../../__mocks__/matchMediaMock'

import { Modal, Alert } from '@hospitalrun/components'
import { act } from '@testing-library/react'
import { mount } from 'enzyme'
import React from 'react'
import { Provider } from 'react-redux'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import PatientRepository from '../../../clients/db/PatientRepository'
import DatePickerWithLabelFormGroup from '../../../components/input/DatePickerWithLabelFormGroup'
import TextInputWithLabelFormGroup from '../../../components/input/TextInputWithLabelFormGroup'
import Diagnosis from '../../../model/Diagnosis'
import Patient from '../../../model/Patient'
import AddDiagnosisModal from '../../../patients/diagnoses/AddDiagnosisModal'
import * as patientSlice from '../../../patients/patient-slice'

const mockStore = createMockStore([thunk])

describe('Add Diagnosis Modal', () => {
  beforeEach(() => {
    jest.spyOn(PatientRepository, 'find')
    jest.spyOn(PatientRepository, 'saveOrUpdate')
  })

  it('should render a modal with the correct labels', () => {
    const store = mockStore({
      patient: {
        patient: {
          id: '1234',
        },
      },
    })
    const wrapper = mount(
      <Provider store={store}>
        <AddDiagnosisModal show onCloseButtonClick={jest.fn()} />
      </Provider>,
    )
    wrapper.update()
    const modal = wrapper.find(Modal)
    expect(modal).toHaveLength(1)
    expect(modal.prop('title')).toEqual('patient.diagnoses.new')
    expect(modal.prop('closeButton')?.children).toEqual('actions.cancel')
    expect(modal.prop('closeButton')?.color).toEqual('danger')
    expect(modal.prop('successButton')?.children).toEqual('patient.diagnoses.new')
    expect(modal.prop('successButton')?.color).toEqual('success')
    expect(modal.prop('successButton')?.icon).toEqual('add')
  })

  it('should display an errors', () => {
    const expectedDiagnosisError = {
      message: 'some message',
      date: 'some date message',
      name: 'some date message',
    }
    const store = mockStore({
      patient: {
        diagnosisError: expectedDiagnosisError,
      },
    })
    const wrapper = mount(
      <Provider store={store}>
        <AddDiagnosisModal show onCloseButtonClick={jest.fn()} />
      </Provider>,
    )
    wrapper.update()

    expect(wrapper.find(Alert)).toHaveLength(1)

    expect(wrapper.find(Alert).prop('title')).toEqual('states.error')
    expect(wrapper.find(Alert).prop('message')).toContain(expectedDiagnosisError.message)
    expect(wrapper.find(TextInputWithLabelFormGroup).prop('feedback')).toContain(
      expectedDiagnosisError.name,
    )
    expect(wrapper.find(TextInputWithLabelFormGroup).prop('isInvalid')).toBeTruthy()
    expect(wrapper.find(DatePickerWithLabelFormGroup).prop('feedback')).toContain(
      expectedDiagnosisError.date,
    )
    expect(wrapper.find(DatePickerWithLabelFormGroup).prop('isInvalid')).toBeTruthy()
  })

  describe('cancel', () => {
    it('should call the onCloseButtonClick function when the close button is clicked', () => {
      const onCloseButtonClickSpy = jest.fn()
      const store = mockStore({
        patient: {
          patient: {
            id: '1234',
          },
        },
      })
      const wrapper = mount(
        <Provider store={store}>
          <AddDiagnosisModal show onCloseButtonClick={onCloseButtonClickSpy} />
        </Provider>,
      )
      wrapper.update()

      act(() => {
        const modal = wrapper.find(Modal)
        const { onClick } = modal.prop('closeButton') as any
        onClick()
      })

      expect(onCloseButtonClickSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('save', () => {
    it('should dispatch add diagnosis', () => {
      const expectedName = 'expected name'
      const expectedDate = new Date()
      jest.spyOn(patientSlice, 'addDiagnosis')
      const patient = {
        id: '1234',
        givenName: 'some name',
      }

      jest.spyOn(PatientRepository, 'find').mockResolvedValue(patient as Patient)
      jest.spyOn(PatientRepository, 'saveOrUpdate').mockResolvedValue(patient as Patient)

      const diagnosis = {
        name: expectedName,
        diagnosisDate: expectedDate.toISOString(),
      } as Diagnosis

      const store = mockStore({
        patient: {
          patient,
        },
      })
      const wrapper = mount(
        <Provider store={store}>
          <AddDiagnosisModal show onCloseButtonClick={jest.fn()} />
        </Provider>,
      )

      act(() => {
        const input = wrapper.findWhere((c: any) => c.prop('name') === 'name')
        const onChange = input.prop('onChange')
        onChange({ target: { value: expectedName } })
      })
      wrapper.update()

      act(() => {
        const input = wrapper.findWhere((c: any) => c.prop('name') === 'diagnosisDate')
        const onChange = input.prop('onChange')
        onChange(expectedDate)
      })
      wrapper.update()

      act(() => {
        const modal = wrapper.find(Modal)
        const { onClick } = modal.prop('successButton') as any
        onClick()
      })

      expect(patientSlice.addDiagnosis).toHaveBeenCalledWith(patient.id, { ...diagnosis })
    })
  })
})
