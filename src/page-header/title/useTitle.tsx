import { useEffect } from 'react'
// import { useDispatch } from 'react-redux'

// import { updateTitle } from './title-slice'
import { useTitleDispatch } from './TitleContext'

export default function useTitle(title: string): void {
  // const dispatch = useDispatch()
  const dispatch = useTitleDispatch()

  useEffect(() => dispatch({ type: 'setTitle', payload: title }), [dispatch, title])
}
