import React from 'react'
import { useHistory } from 'react-router'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
  Breadcrumb as HrBreadcrumb,
  BreadcrumbItem as HrBreadcrumbItem,
} from '@hospitalrun/components'
import { RootState } from '../store'

const Breadcrumbs = () => {
  const history = useHistory()
  const { t } = useTranslation()
  const { breadcrumbs } = useSelector((state: RootState) => state.breadcrumbs)

  return (
    <HrBreadcrumb>
      {breadcrumbs
        .slice()
        .sort((b1, b2) => b1.location.length - b2.location.length)
        .map(({ i18nKey, text, location }, index) => {
          const isLast = index === breadcrumbs.length - 1
          const onClick = !isLast ? () => history.push(location) : undefined

          return (
            <HrBreadcrumbItem key={location} active={isLast} onClick={onClick}>
              {i18nKey ? t(i18nKey) : text}
            </HrBreadcrumbItem>
          )
        })}
    </HrBreadcrumb>
  )
}

export default Breadcrumbs
