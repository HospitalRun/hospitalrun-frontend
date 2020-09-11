import { useEffect } from 'react'
// import { useDispatch } from 'react-redux'

// import { updateTitle } from './title-slice'
import { useUpdateTitle } from './TitleContext'

export default function useTitle(title: string): void {
  // const dispatch = useDispatch()
  const updateTitle = useUpdateTitle()

  useEffect(() => updateTitle(title))
}
