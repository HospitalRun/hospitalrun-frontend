import * as components from '@hospitalrun/components'
// import { act } from '@testing-library/react'
import format from 'date-fns/format'
import { mount } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
// import { startOfDay, subYears } from 'date-fns'
import { act } from 'react-dom/test-utils'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

// import Diagnoses from '../../../patients/diagnoses/Diagnoses'
import NewAllergyModal from '../../../patients/allergies/NewAllergyModal'
import AddDiagnosisModal from '../../../patients/diagnoses/AddDiagnosisModal'
import ImportantPatientInfo from '../../../patients/view/ImportantPatientInfo'
import AddVisitModal from '../../../patients/visits/AddVisitModal'
import PatientRepository from '../../../shared/db/PatientRepository'
import CarePlan from '../../../shared/model/CarePlan'
import Diagnosis from '../../../shared/model/Diagnosis'
// import Allergies from '../../../patients/allergies/Allergies'
// import AllergiesList from '../../../patients/allergies/AllergiesList'
// import PatientRepository from '../../../shared/db/PatientRepository'
import Patient from '../../../shared/model/Patient'
import Permissions from '../../../shared/model/Permissions'
import { RootState } from '../../../shared/store'
// import * as getPatientName from '../../../patients/util/patient-name-util'
// import AddCarePlanModal from '../../../patients/care-plans/AddCarePlanModal'

const mockStore = createMockStore<RootState, any>([thunk])

describe('Important Patient Info Panel', () => {
  let history: any
  let user: any
  let store: any

  const expectedPatient = {
    id: '123',
    sex: 'male',
    fullName: 'full Name',
    code: 'P-123',
    dateOfBirth: format(new Date(), 'MM/dd/yyyy'),
    diagnoses: [
      { id: '123', name: 'diagnosis1', diagnosisDate: new Date().toISOString() } as Diagnosis,
    ],
    allergies: [
      { id: '1', name: 'allergy1' },
      { id: '2', name: 'allergy2' },
    ],
    carePlans: [
      {
        id: '123',
        title: 'title1',
        description: 'test',
        diagnosisId: '12345',
        status: 'status' as string,
        intent: 'intent' as string,
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        createdOn: new Date().toISOString(),
        note: 'note',
      } as CarePlan,
    ],
  } as Patient

  const setup = async (patient = expectedPatient, permissions: Permissions[]) => {
    jest.resetAllMocks()
    jest.spyOn(PatientRepository, 'find').mockResolvedValue(patient)
    history = createMemoryHistory()
    user = { permissions }
    store = mockStore({ patient, user } as any)

    let wrapper: any

    await act(async () => {
      wrapper = await mount(
        <Provider store={store}>
          <Router history={history}>
            <ImportantPatientInfo patient={patient} />
          </Router>
        </Provider>,
      )
    })
    wrapper.update()
    return wrapper
  }

  describe("patient's full name, patient's code, sex, and date of birth", () => {
    it("should render patient's full name", async () => {
      const wrapper = await setup(expectedPatient, [])
      const code = wrapper.find('.col-2')
      expect(code.at(0).text()).toEqual(expectedPatient.fullName)
    })

    it("should render patient's code", async () => {
      const wrapper = await setup(expectedPatient, [])
      const code = wrapper.find('.col-2')
      expect(code.at(1).text()).toEqual(`patient.code${expectedPatient.code}`)
    })

    it("should render patient's sex", async () => {
      const wrapper = await setup(expectedPatient, [])
      const sex = wrapper.find('.patient-sex')
      expect(sex.text()).toEqual(`patient.sex${expectedPatient.sex}`)
    })

    it("should render patient's dateOfDate", async () => {
      const wrapper = await setup(expectedPatient, [])
      const sex = wrapper.find('.patient-dateOfBirth')
      expect(sex.text()).toEqual(`patient.dateOfBirth${expectedPatient.dateOfBirth}`)
    })
  })

  describe('add new visit button', () => {
    it('should render an add visit button if user has correct permissions', async () => {
      const wrapper = await setup(expectedPatient, [Permissions.AddVisit])

      const addNewButton = wrapper.find(components.Button)
      expect(addNewButton).toHaveLength(1)
      expect(addNewButton.text().trim()).toEqual('patient.visits.new')
    })

    it('should open the add visit modal on click', async () => {
      const wrapper = await setup(expectedPatient, [Permissions.AddVisit])

      act(() => {
        const addNewButton = wrapper.find(components.Button)
        const onClick = addNewButton.prop('onClick') as any
        onClick()
      })
      wrapper.update()

      const modal = wrapper.find(AddVisitModal)
      expect(modal.prop('show')).toBeTruthy()
    })

    it('should close the modal when the close button is clicked', async () => {
      const wrapper = await setup(expectedPatient, [Permissions.AddVisit])

      act(() => {
        const addNewButton = wrapper.find(components.Button)
        const onClick = addNewButton.prop('onClick') as any
        onClick()
      })
      wrapper.update()

      act(() => {
        const modal = wrapper.find(AddVisitModal)
        const onClose = modal.prop('onCloseButtonClick') as any
        onClose()
      })
      wrapper.update()

      expect(wrapper.find(AddVisitModal).prop('show')).toBeFalsy()
    })

    it('should not render new visit button if user does not have permissions', async () => {
      const wrapper = await setup(expectedPatient, [])

      expect(wrapper.find(components.Button)).toHaveLength(0)
    })
  })

  describe('add new allergy button', () => {
    it('should render an add allergy button if user has correct permissions', async () => {
      const wrapper = await setup(expectedPatient, [Permissions.AddAllergy])

      const addNewButton = wrapper.find(components.Button)
      expect(addNewButton).toHaveLength(1)
      expect(addNewButton.text().trim()).toEqual('patient.allergies.new')
    })

    it('should open the add allergy modal on click', async () => {
      const wrapper = await setup(expectedPatient, [Permissions.AddAllergy])

      act(() => {
        const addNewButton = wrapper.find(components.Button)
        const onClick = addNewButton.prop('onClick') as any
        onClick()
      })
      wrapper.update()

      const modal = wrapper.find(NewAllergyModal)
      expect(modal.prop('show')).toBeTruthy()
    })

    it('should close the modal when the close button is clicked', async () => {
      const wrapper = await setup(expectedPatient, [Permissions.AddAllergy])

      act(() => {
        const addNewButton = wrapper.find(components.Button)
        const onClick = addNewButton.prop('onClick') as any
        onClick()
      })
      wrapper.update()

      act(() => {
        const modal = wrapper.find(NewAllergyModal)
        const onClose = modal.prop('onCloseButtonClick') as any
        onClose()
      })
      wrapper.update()

      expect(wrapper.find(NewAllergyModal).prop('show')).toBeFalsy()
    })

    it('should not render new allergy button if user does not have permissions', async () => {
      const wrapper = await setup(expectedPatient, [])

      expect(wrapper.find(components.Button)).toHaveLength(0)
    })
  })

  describe('add diagnoses button', () => {
    it('should render an add diagnosis button if user has correct permissions', async () => {
      const wrapper = await setup(expectedPatient, [Permissions.AddDiagnosis])

      const addNewButton = wrapper.find(components.Button)
      expect(addNewButton).toHaveLength(1)
      expect(addNewButton.text().trim()).toEqual('patient.diagnoses.new')
    })

    it('should open the add diagnosis modal on click', async () => {
      const wrapper = await setup(expectedPatient, [Permissions.AddDiagnosis])

      act(() => {
        const addNewButton = wrapper.find(components.Button)
        const onClick = addNewButton.prop('onClick') as any
        onClick()
      })
      wrapper.update()

      const modal = wrapper.find(AddDiagnosisModal)
      expect(modal.prop('show')).toBeTruthy()
    })

    it('should close the modal when the close button is clicked', async () => {
      const wrapper = await setup(expectedPatient, [Permissions.AddDiagnosis])

      act(() => {
        const addNewButton = wrapper.find(components.Button)
        const onClick = addNewButton.prop('onClick') as any
        onClick()
      })
      wrapper.update()

      act(() => {
        const modal = wrapper.find(AddDiagnosisModal)
        const onClose = modal.prop('onCloseButtonClick') as any
        onClose()
      })
      wrapper.update()

      expect(wrapper.find(AddDiagnosisModal).prop('show')).toBeFalsy()
    })

    it('should not render new diagnosis button if user does not have permissions', async () => {
      const wrapper = await setup(expectedPatient, [])

      expect(wrapper.find(components.Button)).toHaveLength(0)
    })
  })

  //   describe('add new care plan button', () => {
  //     it('should render an add diagnosis button if user has correct permissions', async () => {
  //         const  wrapper  = await setup(expectedPatient, [Permissions.AddCarePlan])

  //         const addNewButton = wrapper.find(components.Button)
  //         expect(addNewButton).toHaveLength(1)
  //         expect(addNewButton.text().trim()).toEqual('patient.carePlan.new')
  //       })

  //       it('should open the add care plan modal on click', async () => {
  //         const wrapper = await setup(expectedPatient, [Permissions.AddCarePlan])

  //         act(() => {
  //           const addNewButton = wrapper.find(components.Button)
  //           const onClick = addNewButton.prop('onClick') as any
  //           onClick()
  //         })
  //         wrapper.update()

  //         const modal = wrapper.find(AddCarePlanModal)
  //         expect(modal.prop('show')).toBeTruthy()
  //       })

  //       it('should close the modal when the close button is clicked', async () => {
  //         const wrapper = await setup(expectedPatient, [Permissions.AddCarePlan])

  //         act(() => {
  //           const addNewButton = wrapper.find(components.Button)
  //           const onClick = addNewButton.prop('onClick') as any
  //           onClick()
  //         })
  //         wrapper.update()

  //         act(() => {
  //           const modal = wrapper.find(AddCarePlanModal)
  //           const onClose = modal.prop('onCloseButtonClick') as any
  //           onClose()
  //         })
  //         wrapper.update()

  //         expect(wrapper.find(AddCarePlanModal).prop('show')).toBeFalsy()
  //       })

  //       it('should not render new care plan button if user does not have permissions', async () => {
  //         const wrapper = await setup(expectedPatient, [])

  //         expect(wrapper.find(components.Button)).toHaveLength(0)
  //       })
  //   })
})
