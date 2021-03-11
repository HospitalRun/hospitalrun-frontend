import { Button } from '@hospitalrun/components'
import { render, screen } from '@testing-library/react'
import React from 'react'

import * as ButtonBarProvider from '../../../page-header/button-toolbar/ButtonBarProvider'
import ButtonToolBar from '../../../page-header/button-toolbar/ButtonToolBar'

describe('Button Tool Bar', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should render the buttons in the provider', () => {
    const buttons: React.ReactNode[] = [
      <Button key="test1">Test 1</Button>,
      <Button key="test2">Test 2</Button>,
    ]
    jest.spyOn(ButtonBarProvider, 'useButtons').mockReturnValue(buttons)

    render(<ButtonToolBar />)
    const renderedButtons = screen.getAllByRole('button')

    expect(renderedButtons[0]).toHaveTextContent('Test 1')
    expect(renderedButtons[1]).toHaveTextContent('Test 2')
  })

  it('should return null when there is no button in the provider', () => {
    jest.spyOn(ButtonBarProvider, 'useButtons').mockReturnValue([])

    render(<ButtonToolBar />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
