import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Breadcrumb from 'model/Breadcrumb'
import { addBreadcrumbs, removeBreadcrumbs } from './breadcrumbs-slice'

export default function useAddBreadcrumbs(breadcrumbs: Breadcrumb[]): void {
  const dispatch = useDispatch()
  const breadcrumbsStringified = JSON.stringify(breadcrumbs)

  useEffect(() => {
    const breadcrumbsParsed = JSON.parse(breadcrumbsStringified)
    dispatch(addBreadcrumbs(breadcrumbsParsed))

    return () => {
      dispatch(removeBreadcrumbs(breadcrumbsParsed))
    }
  }, [breadcrumbsStringified, dispatch])
}
