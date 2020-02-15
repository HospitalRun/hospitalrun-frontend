import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Breadcrumb from 'model/Breadcrumb'
import { addBreadcrumbs, removeBreadcrumbs } from './breadcrumbs-slice'

export default function useAddBreadcrumbs(breadcrumbs: Breadcrumb[]): void {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(addBreadcrumbs(breadcrumbs))

    return () => {
      dispatch(removeBreadcrumbs(breadcrumbs))
    }
  }, [breadcrumbs, dispatch, JSON.stringify(breadcrumbs)])
}
