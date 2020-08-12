import { Icon, Typography, Button } from '@hospitalrun/components'
import { mount } from 'enzyme'
import React from 'react'

import NoPatientsExist from '../../../patients/search/NoPatientsExist'

describe('NoPatientsExist', () => {
  const setup = () => mount(<NoPatientsExist />)

  it('should render an icon and a button with typography', () => {
    const wrapper = setup()

    const addNewPatient = wrapper.find(NoPatientsExist)
    expect(addNewPatient).toHaveLength(1)

    const icon = wrapper.find(Icon).first()
    const typography = wrapper.find(Typography)
    const button = wrapper.find(Button)
    const iconType = icon.prop('icon')
    const iconSize = icon.prop('size')
    const typographyText = typography.prop('children')
    const typographyVariant = typography.prop('variant')
    const buttonIcon = button.prop('icon')
    const buttonText = button.prop('children')

    expect(iconType).toEqual('patients')
    expect(iconSize).toEqual('6x')
    expect(typographyText).toEqual('patients.noPatients')
    expect(typographyVariant).toEqual('h5')
    expect(buttonIcon).toEqual('patient-add')
    expect(buttonText).toEqual('patients.newPatient')
  })
})
