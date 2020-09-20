import { Alert, List, ListItem } from '@hospitalrun/components'
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'

import DiagnosesList from '../../../patients/diagnoses/DiagnosesList'
import PatientRepository from '../../../shared/db/PatientRepository'
import Diagnosis from '../../../shared/model/Diagnosis'
import Patient from '../../../shared/model/Patient'

const expectedDiagnoses = [
  { id: '123', name: 'diagnosis1', diagnosisDate: new Date().toISOString() } as Diagnosis,
]

describe('Diagnoses list', () => {
  const setup = async (diagnoses: Diagnosis[]) => {
    const mockPatient = { id: '123', diagnoses } as Patient
    jest.spyOn(PatientRepository, 'find').mockResolvedValueOnce(mockPatient)
    let wrapper: any
    await act(async () => {
      wrapper = await mount(<DiagnosesList patientId={mockPatient.id} />)
    })

    wrapper.update()
    return { wrapper: wrapper as ReactWrapper }
  }

  it('should list the patients diagnoses', async () => {
    const diagnoses = expectedDiagnoses as Diagnosis[]
    const { wrapper } = await setup(diagnoses)

    const listItems = wrapper.find(ListItem)

    expect(wrapper.exists(List)).toBeTruthy()
    expect(listItems).toHaveLength(expectedDiagnoses.length)
    expect(listItems.at(0).text()).toEqual(expectedDiagnoses[0].name)
  })

  it('should render a warning message if the patient does not have any diagnoses', async () => {
    const { wrapper } = await setup([])

    const alert = wrapper.find(Alert)

    expect(wrapper.exists(Alert)).toBeTruthy()
    expect(wrapper.exists(List)).toBeFalsy()

    expect(alert.prop('color')).toEqual('warning')
    expect(alert.prop('title')).toEqual('patient.diagnoses.warning.noDiagnoses')
    expect(alert.prop('message')).toEqual('patient.diagnoses.addDiagnosisAbove')
  })
})
