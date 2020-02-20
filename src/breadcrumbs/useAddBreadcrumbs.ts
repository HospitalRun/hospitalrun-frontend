import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Breadcrumb from 'model/Breadcrumb'
import { addBreadcrumbs, removeBreadcrumbs } from './breadcrumbs-slice'

export default function useAddBreadcrumbs(breadcrumbs: Breadcrumb[], withDashboard = false): void {
  const dispatch = useDispatch()

  const breadcrumbsStringified = withDashboard
    ? JSON.stringify([...breadcrumbs, { i18nKey: 'dashboard.label', location: '/' }])
    : JSON.stringify(breadcrumbs)

  useEffect(() => {
    const breadcrumbsParsed: Breadcrumb[] = JSON.parse(breadcrumbsStringified)
    dispatch(addBreadcrumbs(breadcrumbsParsed))

    return () => {
      dispatch(removeBreadcrumbs(breadcrumbsParsed))
    }
  }, [breadcrumbsStringified, dispatch])
}
