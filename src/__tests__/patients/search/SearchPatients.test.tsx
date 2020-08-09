import { mount } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'

import PatientSearchInput from '../../../patients/search/PatientSearchInput'
import SearchPatients from '../../../patients/search/SearchPatients'
import ViewPatientsTable from '../../../patients/search/ViewPatientsTable'
import PatientRepository from '../../../shared/db/PatientRepository'

describe('Search Patients', () => {
  const setup = () => {
    const wrapper = mount(<SearchPatients />)

    return { wrapper }
  }

  beforeEach(() => {
    jest.spyOn(PatientRepository, 'search').mockResolvedValueOnce([])
  })

  it('should render a patient search input', () => {
    const { wrapper } = setup()

    expect(wrapper.exists(PatientSearchInput)).toBeTruthy()
  })

  it('should render a view patients table', () => {
    const { wrapper } = setup()

    expect(wrapper.exists(ViewPatientsTable)).toBeTruthy()
  })

  it('should update view patients table search request when patient search input changes', () => {
    const expectedSearch = { queryString: 'someQueryString' }
    const { wrapper } = setup()

    act(() => {
      const patientSearch = wrapper.find(PatientSearchInput)
      const onChange = patientSearch.prop('onChange')
      onChange(expectedSearch)
    })
    wrapper.update()

    const patientsTable = wrapper.find(ViewPatientsTable)
    expect(patientsTable.prop('searchRequest')).toEqual(expectedSearch)
  })
})
