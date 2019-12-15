import '../../__mocks__/matchMediaMock'
import React from 'react'
import { Button } from '@hospitalrun/components'
import { shallow, mount } from 'enzyme'
import NewPatient from '../../patients/new/NewPatientForm'
import TextInputWithLabelFormGroup from '../../components/input/TextInputWithLabelFormGroup'
import SelectWithLabelFormGroup from '../../components/input/SelectWithLableFormGroup'
import DatePickerWithLabelFormGroup from '../../components/input/DatePickerWithLabelFormGroup'
import TextFieldWithLabelFormGroup from '../../components/input/TextFieldWithLabelFormGroup'

describe('New Patient Form', () => {
  describe('layout', () => {
    it('should have a "Basic Information" header', () => {
      const wrapper = shallow(<NewPatient />)
      const basicInformationHeader = wrapper.find('h3').at(0)

      expect(basicInformationHeader.text()).toEqual('patient.basicInformation')
    })

    it('should have a prefix text box', () => {
      const wrapper = shallow(<NewPatient />)
      const prefixTextInput = wrapper.findWhere((w) => w.prop('name') === 'prefix')

      expect(prefixTextInput).toHaveLength(1)
      expect(prefixTextInput.type()).toBe(TextInputWithLabelFormGroup)
      expect(prefixTextInput.prop('name')).toEqual('prefix')
      expect(prefixTextInput.prop('isEditable')).toBeTruthy()
      expect(prefixTextInput.prop('label')).toEqual('patient.prefix')
    })

    it('should have a given name text box', () => {
      const wrapper = shallow(<NewPatient />)
      const givenNameTextInput = wrapper.findWhere((w) => w.prop('name') === 'givenName')

      expect(givenNameTextInput).toHaveLength(1)
      expect(givenNameTextInput.type()).toBe(TextInputWithLabelFormGroup)
      expect(givenNameTextInput.prop('name')).toEqual('givenName')
      expect(givenNameTextInput.prop('isEditable')).toBeTruthy()
      expect(givenNameTextInput.prop('label')).toEqual('patient.givenName')
    })

    it('should have a family name text box', () => {
      const wrapper = shallow(<NewPatient />)
      const familyNameTextInput = wrapper.findWhere((w) => w.prop('name') === 'familyName')

      expect(familyNameTextInput).toHaveLength(1)
      expect(familyNameTextInput.type()).toBe(TextInputWithLabelFormGroup)
      expect(familyNameTextInput.prop('name')).toEqual('familyName')
      expect(familyNameTextInput.prop('isEditable')).toBeTruthy()
      expect(familyNameTextInput.prop('label')).toEqual('patient.familyName')
    })

    it('should have a suffix text box', () => {
      const wrapper = shallow(<NewPatient />)
      const suffixTextInput = wrapper.findWhere((w) => w.prop('name') === 'suffix')

      expect(suffixTextInput).toHaveLength(1)
      expect(suffixTextInput.type()).toBe(TextInputWithLabelFormGroup)
      expect(suffixTextInput.prop('name')).toEqual('suffix')
      expect(suffixTextInput.prop('isEditable')).toBeTruthy()
      expect(suffixTextInput.prop('label')).toEqual('patient.suffix')
    })

    it('should have a sex dropdown with the proper options', () => {
      const wrapper = shallow(<NewPatient />)
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
      const wrapper = shallow(<NewPatient />)
      const suffixTextInput = wrapper.findWhere((w) => w.prop('name') === 'dateOfBirth')

      expect(suffixTextInput).toHaveLength(1)
      expect(suffixTextInput.type()).toBe(DatePickerWithLabelFormGroup)
      expect(suffixTextInput.prop('name')).toEqual('dateOfBirth')
      expect(suffixTextInput.prop('isEditable')).toBeTruthy()
      expect(suffixTextInput.prop('label')).toEqual('patient.dateOfBirth')
    })

    it('should have a patient type dropdown with the proper options', () => {
      const wrapper = shallow(<NewPatient />)
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
      const wrapper = shallow(<NewPatient />)
      const occupationTextInput = wrapper.findWhere((w) => w.prop('name') === 'occupation')

      expect(occupationTextInput).toHaveLength(1)
      expect(occupationTextInput.type()).toBe(TextInputWithLabelFormGroup)
      expect(occupationTextInput.prop('name')).toEqual('occupation')
      expect(occupationTextInput.prop('isEditable')).toBeTruthy()
      expect(occupationTextInput.prop('label')).toEqual('patient.occupation')
    })

    it('should have a preferred language text box', () => {
      const wrapper = shallow(<NewPatient />)
      const occupationTextInput = wrapper.findWhere((w) => w.prop('name') === 'preferredLanguage')

      expect(occupationTextInput).toHaveLength(1)
      expect(occupationTextInput.type()).toBe(TextInputWithLabelFormGroup)
      expect(occupationTextInput.prop('name')).toEqual('preferredLanguage')
      expect(occupationTextInput.prop('isEditable')).toBeTruthy()
      expect(occupationTextInput.prop('label')).toEqual('patient.preferredLanguage')
    })

    it('should have a "Contact Information" header', () => {
      const wrapper = shallow(<NewPatient />)
      const contactInformationHeader = wrapper.find('h3').at(1)

      expect(contactInformationHeader.text()).toEqual('patient.contactInformation')
    })

    it('should have a phone number text box', () => {
      const wrapper = shallow(<NewPatient />)
      const phoneNumberTextInput = wrapper.findWhere((w) => w.prop('name') === 'phoneNumber')

      expect(phoneNumberTextInput).toHaveLength(1)
      expect(phoneNumberTextInput.type()).toBe(TextInputWithLabelFormGroup)
      expect(phoneNumberTextInput.prop('name')).toEqual('phoneNumber')
      expect(phoneNumberTextInput.prop('isEditable')).toBeTruthy()
      expect(phoneNumberTextInput.prop('label')).toEqual('patient.phoneNumber')
    })

    it('should have a email text box', () => {
      const wrapper = shallow(<NewPatient />)
      const emailTextInput = wrapper.findWhere((w) => w.prop('name') === 'email')

      expect(emailTextInput).toHaveLength(1)
      expect(emailTextInput.type()).toBe(TextInputWithLabelFormGroup)
      expect(emailTextInput.prop('name')).toEqual('email')
      expect(emailTextInput.prop('isEditable')).toBeTruthy()
      expect(emailTextInput.prop('label')).toEqual('patient.email')
    })

    it('should have a address text field', () => {
      const wrapper = shallow(<NewPatient />)
      const addressTextField = wrapper.findWhere((w) => w.prop('name') === 'address')

      expect(addressTextField).toHaveLength(1)
      expect(addressTextField.type()).toBe(TextFieldWithLabelFormGroup)
      expect(addressTextField.prop('name')).toEqual('address')
      expect(addressTextField.prop('isEditable')).toBeTruthy()
      expect(addressTextField.prop('label')).toEqual('patient.address')
    })

    it('should render a save button', () => {
      const wrapper = mount(<NewPatient />)
      const saveButton = wrapper.find(Button).at(0)

      expect(saveButton.text().trim()).toEqual('actions.save')
    })

    it('should render a cancel button', () => {
      const wrapper = mount(<NewPatient />)
      const cancelButton = wrapper.find(Button).at(1)

      expect(cancelButton.prop('color')).toEqual('danger')
      expect(cancelButton.text().trim()).toEqual('actions.cancel')
    })
  })
})
