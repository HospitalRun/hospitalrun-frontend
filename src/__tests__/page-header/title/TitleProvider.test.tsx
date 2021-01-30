import { renderHook, act } from '@testing-library/react-hooks'
import React from 'react'

import { TitleProvider, useTitle, useUpdateTitle } from '../../../page-header/title/TitleContext'

describe('useTitle', () => {
  it('should call the updateTitle with the correct data.', () => {
    const expectedTitle = 'title'
    const wrapper: React.FC = ({ children }) => <TitleProvider>{children}</TitleProvider>

    const { result } = renderHook(
      () => {
        const update = useUpdateTitle()
        const title = useTitle()
        return { ...title, update }
      },
      { wrapper },
    )

    act(() => result.current.update(expectedTitle))

    expect(result.current.title).toBe(expectedTitle)
  })
})
