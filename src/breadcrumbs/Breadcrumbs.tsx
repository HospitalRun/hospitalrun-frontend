import React from 'react'
import { useHistory } from 'react-router'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Breadcrumb, BreadcrumbItem } from '@hospitalrun/components'
import { RootState } from '../store'

const Breadcrumbs = () => {
  const history = useHistory()
  const { t } = useTranslation()
  const { breadcrumbs } = useSelector((state: RootState) => state.breadcrumbs)

  if (breadcrumbs.length === 0) {
    return null
  }

  return (
    <Breadcrumb>
      {breadcrumbs.map(({ i18nKey, text, location }, index) => {
        const isLast = index === breadcrumbs.length - 1
        const onClick = !isLast ? () => history.push(location) : undefined

        return (
          <BreadcrumbItem key={location} active={isLast} onClick={onClick}>
            {i18nKey ? t(i18nKey) : text}
          </BreadcrumbItem>
        )
      })}
    </Breadcrumb>
  )
}

export default Breadcrumbs
