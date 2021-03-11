import { Button } from '@hospitalrun/components'
import { renderHook, act } from '@testing-library/react-hooks'
import React from 'react'

import {
  ButtonBarProvider,
  useButtons,
  useButtonToolbarSetter,
} from '../../../page-header/button-toolbar/ButtonBarProvider'

describe('Button Bar Provider', () => {
  it('should update and fetch data from the button bar provider', () => {
    const expectedButtons = [<Button>test 1</Button>]
    const wrapper: React.FC = ({ children }) => <ButtonBarProvider>{children}</ButtonBarProvider>

    const { result } = renderHook(
      () => {
        const update = useButtonToolbarSetter()
        const buttons = useButtons()
        return { buttons, update }
      },
      { wrapper },
    )

    act(() => result.current.update(expectedButtons))

    expect(result.current.buttons).toEqual(expectedButtons)
  })
})
