import { Modal, Alert } from '@hospitalrun/components'
import { act } from '@testing-library/react'
import { mount } from 'enzyme'
import React from 'react'
import { Provider } from 'react-redux'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import AddDiagnosisModal from '../../../patients/diagnoses/AddDiagnosisModal'
import * as patientSlice from '../../../patients/patient-slice'
import DatePickerWithLabelFormGroup from '../../../shared/components/input/DatePickerWithLabelFormGroup'
import TextInputWithLabelFormGroup from '../../../shared/components/input/TextInputWithLabelFormGroup'
import PatientRepository from '../../../shared/db/PatientRepository'
// import Diagnosis, { DiagnosisStatus } from '../../../shared/model/Diagnosis'
import Diagnosis from '../../../shared/model/Diagnosis'
import Patient from '../../../shared/model/Patient'
import { RootState } from '../../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])

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
    } as any)
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
      status: 'some status error',
      abatementDate: 'some date message',
      onsetDate: 'some date message',
      note: 'some note message',
    }
    const store = mockStore({
      patient: {
        diagnosisError: expectedDiagnosisError,
      },
    } as any)
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
    expect(wrapper.find(DatePickerWithLabelFormGroup).at(1).prop('feedback')).toContain(
      expectedDiagnosisError.date,
    )
    expect(wrapper.find(TextInputWithLabelFormGroup).prop('isInvalid')).toBeTruthy()
    const abatementDatePicker = wrapper.findWhere((w) => w.prop('name') === 'abatementDate')
    expect(abatementDatePicker.prop('isInvalid')).toBeTruthy()
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
      } as any)
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
      const expectedName = ''
      const expectedDate = new Date()
      // const expectedStatus = DiagnosisStatus.Active
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
        onsetDate: expectedDate.toISOString(),
        abatementDate: expectedDate.toISOString(),
        note: expectedName,
        // status: expectedStatus,
      } as Diagnosis

      const store = mockStore({
        patient: {
          patient,
        },
      } as any)
      const wrapper = mount(
        <Provider store={store}>
          <AddDiagnosisModal show onCloseButtonClick={jest.fn()} />
        </Provider>,
      )

      act(() => {
        const input = wrapper.findWhere((c: any) => c.prop('name') === 'onsetDate')
        const onChange = input.prop('onChange')
        onChange(expectedDate)
      })
      wrapper.update()

      act(() => {
        const input = wrapper.findWhere((c: any) => c.prop('name') === 'abatementDate')
        const onChange = input.prop('onChange')
        onChange(expectedDate)
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
      wrapper.update()

      // act(() => {
      //   const statusSelector = wrapper.findWhere((w) => w.prop('name') === 'status')
      //   const onChange = statusSelector.prop('onChange') as any
      //   onChange([expectedStatus])
      // })

      expect(patientSlice.addDiagnosis).toHaveBeenCalledWith(patient.id, { ...diagnosis })
    })
  })
})
