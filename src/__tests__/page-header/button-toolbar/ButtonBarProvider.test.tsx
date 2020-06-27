import { Button } from '@hospitalrun/components'
import { renderHook } from '@testing-library/react-hooks'
import React, { useEffect } from 'react'

import {
  ButtonBarProvider,
  useButtons,
  useButtonToolbarSetter,
} from '../../../page-header/button-toolbar/ButtonBarProvider'

describe('Button Bar Provider', () => {
  it('should update and fetch data from the button bar provider', () => {
    const expectedButtons = [<Button>test 1</Button>]
    const wrapper = ({ children }: any) => <ButtonBarProvider>{children}</ButtonBarProvider>

    const { result } = renderHook(
      () => {
        const update = useButtonToolbarSetter()
        useEffect(() => {
          update(expectedButtons)
        }, [update])

        return useButtons()
      },
      { wrapper },
    )

    expect(result.current).toEqual(expectedButtons)
  })
})
