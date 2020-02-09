import React from 'react'
import { useLocation, useHistory } from 'react-router'
import { useTranslation } from 'react-i18next'
import {
  Breadcrumb as HrBreadcrumb,
  BreadcrumbItem as HrBreadcrumbItem,
} from '@hospitalrun/components'

interface Item {
  url: string
  active: boolean
}

const urlToi18nKey: { [url: string]: string } = {
  '/': 'dashboard.label',
  '/patients': 'patients.label',
  '/patients/new': 'patients.newPatient',
  '/appointments': 'scheduling.appointments.label',
  '/appointments/new': 'scheduling.appointments.new',
}

export function getItems(pathname: string): Item[] {
  let url = ''
  const paths = pathname.substring(1).split('/')

  return paths.map((path, index) => {
    url += `/${path}`
    return { url, active: index === paths.length - 1 }
  })
}

const DefaultBreadcrumb = () => {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const history = useHistory()
  const items = getItems(pathname)

  return (
    <HrBreadcrumb>
      {items.map((item) => {
        const onClick = !item.active ? () => history.push(item.url) : undefined

        return (
          <HrBreadcrumbItem key={item.url} active={item.active} onClick={onClick}>
            {t(urlToi18nKey[item.url])}
          </HrBreadcrumbItem>
        )
      })}
    </HrBreadcrumb>
  )
}

export default DefaultBreadcrumb
