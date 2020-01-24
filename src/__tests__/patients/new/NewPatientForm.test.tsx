import '../../../__mocks__/matchMediaMock'
import React, {ChangeEvent} from 'react'
import {shallow, mount} from 'enzyme'
import {Button, Checkbox} from '@hospitalrun/components'
import {render, act, fireEvent} from '@testing-library/react'
import {isEqual, startOfDay, subYears} from 'date-fns'
import NewPatientForm from '../../../patients/new/NewPatientForm'
import TextInputWithLabelFormGroup from '../../../components/input/TextInputWithLabelFormGroup'
import SelectWithLabelFormGroup from '../../../components/input/SelectWithLableFormGroup'
import DatePickerWithLabelFormGroup from '../../../components/input/DatePickerWithLabelFormGroup'
import TextFieldWithLabelFormGroup from '../../../components/input/TextFieldWithLabelFormGroup'
import Patient from '../../../model/Patient'
import {getPatientName} from '../../../patients/util/patient-name-util'

const onSave = jest.fn()
const onCancel = jest.fn()

describe('New Patient Form', () => {
  describe('layout', () => {
    it('should have a "Basic Information" header', () => {
      const wrapper = shallow(<NewPatientForm onCancel={onCancel} onSave={onSave}/>)
      const basicInformationHeader = wrapper.find('h3').at(0)

      expect(basicInformationHeader.text()).toEqual('patient.basicInformation')
    })

    it('should have a prefix text box', () => {
      const wrapper = shallow(<NewPatientForm onCancel={onCancel} onSave={onSave}/>)
      const prefixTextInput = wrapper.findWhere((w) => w.prop('name') === 'prefix')

      expect(prefixTextInput).toHaveLength(1)
      expect(prefixTextInput.type()).toBe(TextInputWithLabelFormGroup)
      expect(prefixTextInput.prop('name')).toEqual('prefix')
      expect(prefixTextInput.prop('isEditable')).toBeTruthy()
      expect(prefixTextInput.prop('label')).toEqual('patient.prefix')
    })

    it('should have a given name text box', () => {
      const wrapper = shallow(<NewPatientForm onCancel={onCancel} onSave={onSave}/>)
      const givenNameTextInput = wrapper.findWhere((w) => w.prop('name') === 'givenName')

      expect(givenNameTextInput).toHaveLength(1)
      expect(givenNameTextInput.type()).toBe(TextInputWithLabelFormGroup)
      expect(givenNameTextInput.prop('name')).toEqual('givenName')
      expect(givenNameTextInput.prop('isEditable')).toBeTruthy()
      expect(givenNameTextInput.prop('label')).toEqual('patient.givenName')
    })

    it('should have a family name text box', () => {
      const wrapper = shallow(<NewPatientForm onCancel={onCancel} onSave={onSave}/>)
      const familyNameTextInput = wrapper.findWhere((w) => w.prop('name') === 'familyName')

      expect(familyNameTextInput).toHaveLength(1)
      expect(familyNameTextInput.type()).toBe(TextInputWithLabelFormGroup)
      expect(familyNameTextInput.prop('name')).toEqual('familyName')
      expect(familyNameTextInput.prop('isEditable')).toBeTruthy()
      expect(familyNameTextInput.prop('label')).toEqual('patient.familyName')
    })

    it('should have a suffix text box', () => {
      const wrapper = shallow(<NewPatientForm onCancel={onCancel} onSave={onSave}/>)
      const suffixTextInput = wrapper.findWhere((w) => w.prop('name') === 'suffix')

      expect(suffixTextInput).toHaveLength(1)
      expect(suffixTextInput.type()).toBe(TextInputWithLabelFormGroup)
      expect(suffixTextInput.prop('name')).toEqual('suffix')
      expect(suffixTextInput.prop('isEditable')).toBeTruthy()
      expect(suffixTextInput.prop('label')).toEqual('patient.suffix')
    })

    it('should have a sex dropdown with the proper options', () => {
      const wrapper = shallow(<NewPatientForm onCancel={onCancel} onSave={onSave}/>)
      const sexDropdown = wrapper.findWhere((w) => w.prop('name') === 'sex')

      expect(sexDropdown).toHaveLength(1)
      expect(sexDropdown.type()).toBe(SelectWithLabelFormGroup)
      expect(sexDropdown.prop('label')).toEqual('patient.sex')
      expect(sexDropdown.prop('name')).toEqual('sex')
      expect(sexDropdown.prop('isEditable')).toBeTruthy()
      expect(sexDropdown.prop('options')).toHaveLength(4)
      expect(sexDropdown.prop('options')[0].label).toEqual('sex.male')
      expect(sexDropdown.prop('options')[0].value).toEqual('male')
      expect(sexDropdown.prop('options')[1].label).toEqual('sex.female')
      expect(sexDropdown.prop('options')[1].value).toEqual('female')
      expect(sexDropdown.prop('options')[2].label).toEqual('sex.other')
      expect(sexDropdown.prop('options')[2].value).toEqual('other')
      expect(sexDropdown.prop('options')[3].label).toEqual('sex.unknown')
      expect(sexDropdown.prop('options')[3].value).toEqual('unknown')
    })

    it('should have a date of birth text box', () => {
      const wrapper = shallow(<NewPatientForm onCancel={onCancel} onSave={onSave}/>)
      const dateOfBirthTextInput = wrapper.findWhere((w) => w.prop('name') === 'dateOfBirth')

      expect(dateOfBirthTextInput).toHaveLength(1)
      expect(dateOfBirthTextInput.type()).toBe(DatePickerWithLabelFormGroup)
      expect(dateOfBirthTextInput.prop('name')).toEqual('dateOfBirth')
      expect(dateOfBirthTextInput.prop('isEditable')).toBeTruthy()
      expect(dateOfBirthTextInput.prop('label')).toEqual('patient.dateOfBirth')
    })

    it('should have a unknown checkbox', () => {
      const wrapper = shallow(<NewPatientForm onCancel={onCancel} onSave={onSave}/>)
      const unknownCheckbox = wrapper.find(Checkbox)
      expect(unknownCheckbox).toHaveLength(1)
      expect(unknownCheckbox.prop('name')).toEqual('unknown')
      expect(unknownCheckbox.prop('label')).toEqual('patient.unknownDateOfBirth')
    })

    it('should have a patient type dropdown with the proper options', () => {
      const wrapper = shallow(<NewPatientForm onCancel={onCancel} onSave={onSave}/>)
      const patientTypeDropdown = wrapper.findWhere((w) => w.prop('name') === 'type')

      expect(patientTypeDropdown).toHaveLength(1)
      expect(patientTypeDropdown.type()).toBe(SelectWithLabelFormGroup)
      expect(patientTypeDropdown.prop('label')).toEqual('patient.type')
      expect(patientTypeDropdown.prop('name')).toEqual('type')
      expect(patientTypeDropdown.prop('isEditable')).toBeTruthy()
      expect(patientTypeDropdown.prop('options')).toHaveLength(2)
      expect(patientTypeDropdown.prop('options')[0].label).toEqual('patient.types.charity')
      expect(patientTypeDropdown.prop('options')[0].value).toEqual('charity')
      expect(patientTypeDropdown.prop('options')[1].label).toEqual('patient.types.private')
      expect(patientTypeDropdown.prop('options')[1].value).toEqual('private')
    })

    it('should have a occupation text box', () => {
      const wrapper = shallow(<NewPatientForm onCancel={onCancel} onSave={onSave}/>)
      const occupationTextInput = wrapper.findWhere((w) => w.prop('name') === 'occupation')

      expect(occupationTextInput).toHaveLength(1)
      expect(occupationTextInput.type()).toBe(TextInputWithLabelFormGroup)
      expect(occupationTextInput.prop('name')).toEqual('occupation')
      expect(occupationTextInput.prop('isEditable')).toBeTruthy()
      expect(occupationTextInput.prop('label')).toEqual('patient.occupation')
    })

    it('should have a preferred language text box', () => {
      const wrapper = shallow(<NewPatientForm onCancel={onCancel} onSave={onSave}/>)
      const preferredLanguageTextInput = wrapper.findWhere(
        (w) => w.prop('name') === 'preferredLanguage',
      )

      expect(preferredLanguageTextInput).toHaveLength(1)
      expect(preferredLanguageTextInput.type()).toBe(TextInputWithLabelFormGroup)
      expect(preferredLanguageTextInput.prop('name')).toEqual('preferredLanguage')
      expect(preferredLanguageTextInput.prop('isEditable')).toBeTruthy()
      expect(preferredLanguageTextInput.prop('label')).toEqual('patient.preferredLanguage')
    })

    it('should have a "Contact Information" header', () => {
      const wrapper = shallow(<NewPatientForm onCancel={onCancel} onSave={onSave}/>)
      const contactInformationHeader = wrapper.find('h3').at(1)

      expect(contactInformationHeader.text()).toEqual('patient.contactInformation')
    })

    it('should have a phone number text box', () => {
      const wrapper = shallow(<NewPatientForm onCancel={onCancel} onSave={onSave}/>)
      const phoneNumberTextInput = wrapper.findWhere((w) => w.prop('name') === 'phoneNumber')

      expect(phoneNumberTextInput).toHaveLength(1)
      expect(phoneNumberTextInput.type()).toBe(TextInputWithLabelFormGroup)
      expect(phoneNumberTextInput.prop('name')).toEqual('phoneNumber')
      expect(phoneNumberTextInput.prop('isEditable')).toBeTruthy()
      expect(phoneNumberTextInput.prop('label')).toEqual('patient.phoneNumber')
    })

    it('should have a email text box', () => {
      const wrapper = shallow(<NewPatientForm onCancel={onCancel} onSave={onSave}/>)
      const emailTextInput = wrapper.findWhere((w) => w.prop('name') === 'email')

      expect(emailTextInput).toHaveLength(1)
      expect(emailTextInput.type()).toBe(TextInputWithLabelFormGroup)
      expect(emailTextInput.prop('name')).toEqual('email')
      expect(emailTextInput.prop('isEditable')).toBeTruthy()
      expect(emailTextInput.prop('label')).toEqual('patient.email')
    })

    it('should have a address text field', () => {
      const wrapper = shallow(<NewPatientForm onCancel={onCancel} onSave={onSave}/>)
      const addressTextField = wrapper.findWhere((w) => w.prop('name') === 'address')

      expect(addressTextField).toHaveLength(1)
      expect(addressTextField.type()).toBe(TextFieldWithLabelFormGroup)
      expect(addressTextField.prop('name')).toEqual('address')
      expect(addressTextField.prop('isEditable')).toBeTruthy()
      expect(addressTextField.prop('label')).toEqual('patient.address')
    })

    it('should render a save button', () => {
      const wrapper = mount(<NewPatientForm onCancel={onCancel} onSave={onSave}/>)
      const saveButton = wrapper.find(Button).at(0)

      expect(saveButton.text().trim()).toEqual('actions.save')
    })

    it('should render a cancel button', () => {
      const wrapper = mount(<NewPatientForm onCancel={onCancel} onSave={onSave}/>)
      const cancelButton = wrapper.find(Button).at(1)

      expect(cancelButton.prop('color')).toEqual('danger')
      expect(cancelButton.text().trim()).toEqual('actions.cancel')
    })
  })

  describe('calculate approximate date of birth', () => {
    it('should calculate the approximate date of birth on change and store the value in the date of birth input', () => {
      const wrapper = shallow(<NewPatientForm onCancel={onCancel} onSave={onSave}/>)
      const unknownCheckbox = wrapper.find(Checkbox)

      act(() => {
        if (unknownCheckbox) {
          ;(unknownCheckbox.prop('onChange') as any)({target: {checked: true}} as ChangeEvent<HTMLInputElement>)
        }
      })

      const approximateAgeInput = wrapper.findWhere((w) => w.prop('name') === 'approximateAge')
      act(() => {
        approximateAgeInput.prop('onChange')({target: {value: 5}})
      })

      const dateOfBirthTextInput = wrapper.findWhere((w) => w.prop('name') === 'dateOfBirth')

      expect(
        isEqual(dateOfBirthTextInput.prop('value'), startOfDay(subYears(new Date(), 5))),
      ).toBeTruthy()
    })

    describe('on unknown checkbox click', () => {
      it('should show a approximate age input box when checkbox is checked', () => {
        const wrapper = shallow(<NewPatientForm onCancel={onCancel} onSave={onSave}/>)
        const approximateAgeInputBefore = wrapper.findWhere(
          (w) => w.prop('name') === 'approximateAge',
        )
        expect(approximateAgeInputBefore).toHaveLength(0)

        const unknownCheckbox = wrapper.find(Checkbox)

        act(() => {
          if (unknownCheckbox) {
            ;(unknownCheckbox.prop('onChange') as any)({target: {checked: true}} as ChangeEvent<HTMLInputElement>)
          }
        })

        const approximateAgeInputerAfter = wrapper.findWhere(
          (w) => w.prop('name') === 'approximateAge',
        )
        expect(approximateAgeInputerAfter).toHaveLength(1)
      })
    })

    describe('save button', () => {
      it('should call the onSave prop with the Patient data', async () => {
        const wrapper = render(<NewPatientForm onCancel={onCancel} onSave={onSave}/>)
        const prefixInput = wrapper.getByPlaceholderText('patient.prefix')
        const givenNameInput = wrapper.getByPlaceholderText('patient.givenName')
        const familyNameInput = wrapper.getByPlaceholderText('patient.familyName')
        const suffixInput = wrapper.getByPlaceholderText('patient.suffix')
        const sexDropdown = wrapper.getByText('patient.sex').nextElementSibling
        const patientTypeDropdown = wrapper.getByText('patient.type').nextElementSibling
        const occupationInput = wrapper.getByPlaceholderText('patient.occupation')
        const preferredLanguageInput = wrapper.getByPlaceholderText('patient.preferredLanguage')
        const phoneNumberInput = wrapper.getByPlaceholderText('patient.phoneNumber')
        const emailInput = wrapper.getByPlaceholderText('email@email.com')
        const addressInput = wrapper.getByText('patient.address').nextElementSibling

        const saveButton = wrapper.getByText('actions.save')

        const expectedPrefix = 'prefix'
        const expectedGivenName = 'given name'
        const expectedFamilyName = 'family name'
        const expectedSuffix = 'suffix'
        const expectedSex = 'male'
        const expectedType = 'charity'
        const expectedOccupation = 'occupation'
        const expectedPreferredLanguage = 'preferred language'
        const expectedPhoneNumber = 'phone number'
        const expectedEmail = 'test@test.com'
        const expectedAddress = 'address'

        act(() => {
          fireEvent.change(prefixInput, {target: {value: expectedPrefix}})
        })

        act(() => {
          fireEvent.change(givenNameInput, {target: {value: expectedGivenName}})
        })

        act(() => {
          fireEvent.change(familyNameInput, {target: {value: expectedFamilyName}})
        })

        act(() => {
          fireEvent.change(suffixInput, {target: {value: expectedSuffix}})
        })

        act(() => {
          if (sexDropdown) {
            fireEvent.change(sexDropdown, {target: {value: expectedSex}})
          }
        })

        act(() => {
          if (patientTypeDropdown) {
            fireEvent.change(patientTypeDropdown, {target: {value: expectedType}})
          }
        })

        act(() => {
          fireEvent.change(occupationInput, {target: {value: expectedOccupation}})
        })

        act(() => {
          fireEvent.change(preferredLanguageInput, {target: {value: expectedPreferredLanguage}})
        })

        act(() => {
          fireEvent.change(phoneNumberInput, {target: {value: expectedPhoneNumber}})
        })

        act(() => {
          fireEvent.change(emailInput, {target: {value: expectedEmail}})
        })

        act(() => {
          if (addressInput) {
            fireEvent.change(addressInput, {target: {value: expectedAddress}})
          }
        })

        act(() => {
          fireEvent.click(saveButton)
        })

        const expectedPatient = {
          prefix: expectedPrefix,
          givenName: expectedGivenName,
          familyName: expectedFamilyName,
          suffix: expectedSuffix,
          sex: expectedSex,
          type: expectedType,
          isApproximateDateOfBirth: false,
          dateOfBirth: '',
          occupation: expectedOccupation,
          preferredLanguage: expectedPreferredLanguage,
          phoneNumber: expectedPhoneNumber,
          email: expectedEmail,
          address: expectedAddress,
          fullName: getPatientName(expectedGivenName, expectedFamilyName, expectedSuffix),
        } as Patient

        expect(onSave).toHaveBeenCalledTimes(1)
        expect(onSave).toHaveBeenLastCalledWith(expectedPatient)
      })
    })

    describe('cancel button', () => {
      it('should navigate back to /patients when clicked', () => {
        const wrapper = shallow(<NewPatientForm onCancel={onCancel} onSave={onSave}/>)

        const cancelButton = wrapper.find(Button).at(1)
        act(() => {
          cancelButton.simulate('click')
        })

        expect(onCancel).toHaveBeenCalledTimes(1)
      })
    })
  })
  describe("Error handling", () => {
    describe("save button", () => {
      it("should display 'no given name error' when form doesn't contain a given name on save button click",
        () => {
          const wrapper = render(<NewPatientForm onCancel={onCancel} onSave={onSave}/>)
          const givenName = wrapper.getByPlaceholderText("patient.givenName")
          const saveButton = wrapper.getByText("actions.save")
          expect(givenName).toBeNull

          act(() => {
            fireEvent.click(saveButton)
          })
          const errorMessage = wrapper.getByText("patient.errors.patientGivenNameRequired")

          expect(errorMessage).toBeTruthy()
          expect(errorMessage.textContent).toMatch("patient.errors.patientGivenNameRequired")
          expect(onSave).toHaveBeenCalledTimes(1)
        })
    })
  })
})
