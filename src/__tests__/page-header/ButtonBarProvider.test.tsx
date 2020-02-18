import '../../__mocks__/matchMediaMock'
import React from 'react'
import { renderHook } from '@testing-library/react-hooks'
import {
  ButtonBarProvider,
  useButtons,
  useButtonToolbarSetter,
} from 'page-header/ButtonBarProvider'
import { Button } from '@hospitalrun/components'

describe('Button Bar Provider', () => {
  it('should update and fetch data from the button bar provider', () => {
    const expectedButtons = [<Button>test 1</Button>]
    const wrapper = ({ children }: any) => <ButtonBarProvider>{children}</ButtonBarProvider>

    const { result } = renderHook(
      () => {
        const update = useButtonToolbarSetter()
        update(expectedButtons)
        return useButtons()
      },
      { wrapper },
    )

    expect(result.current).toEqual(expectedButtons)
  })
})
