import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Breadcrumb from 'model/Breadcrumb'
import { setBreadcrumbs } from './breadcrumbs-slice'

export default function useSetBreadcrumbs(breadcrumbs: Breadcrumb[]): void {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setBreadcrumbs(breadcrumbs))

    return () => {
      dispatch(setBreadcrumbs([]))
    }
  }, [dispatch, breadcrumbs])
}
