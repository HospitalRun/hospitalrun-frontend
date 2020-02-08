import React from 'react'
import { useLocation, useHistory } from 'react-router'
import {
  Breadcrumb as HrBreadcrumb,
  BreadcrumbItem as HrBreadcrumbItem,
} from '@hospitalrun/components'

interface Item {
  name: string
  url: string
}

function getItems(pathname: string): Item[] {
  if (!pathname || pathname === '/') {
    return [{ name: 'dashboard', url: '/' }]
  }

  return pathname
    .substring(1)
    .split('/')
    .map((name) => ({ name, url: '/' }))
}

const Breadcrumb = () => {
  const { pathname } = useLocation()
  const history = useHistory()
  const items = getItems(pathname)
  const lastIndex = items.length - 1

  return (
    <HrBreadcrumb>
      {items.map((item, index) => {
        const isLast = index === lastIndex
        const onClick = !isLast ? () => history.push(item.url) : undefined

        return (
          <HrBreadcrumbItem key={item.name} active={isLast} onClick={onClick}>
            {item.name}
          </HrBreadcrumbItem>
        )
      })}
    </HrBreadcrumb>
  )
}

export default Breadcrumb
