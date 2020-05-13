import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { updateTitle } from 'page-header/title-slice'

export default function useTitle(title: string): void {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(updateTitle(title))
  })
}
