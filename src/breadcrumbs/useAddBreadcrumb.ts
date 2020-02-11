import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Breadcrumb from 'model/Breadcrumb'
import { addBreadcrumb, removeBreadcrumb } from './breadcrumbs-slice'

export default function useAddBreadcrumb(breadcrumb: Breadcrumb): void {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(addBreadcrumb(breadcrumb))

    return () => {
      dispatch(removeBreadcrumb())
    }
  }, [dispatch, breadcrumb])
}
