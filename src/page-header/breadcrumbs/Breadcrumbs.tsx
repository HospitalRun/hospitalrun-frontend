import { Breadcrumb, BreadcrumbItem } from '@hospitalrun/components'
import React from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import useTranslator from '../../shared/hooks/useTranslator'
import { RootState } from '../../shared/store'
import '../../index.css'

const Breadcrumbs = () => {
  const history = useHistory()
  const { t } = useTranslator()
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
          <BreadcrumbItem
            key={location}
            active={isLast}
            onClick={onClick}
            // style={{ color: !isLast ? '#001a39' : '#6c757d' }}
            // style={!isLast ? { color: 'red' } : { color: '#001a39' }}
            // style={isLast ? { backgroundColor: 'red' } : { color: 'black' }}
          >
            {i18nKey ? t(i18nKey) : text}
          </BreadcrumbItem>
        )
      })}
    </Breadcrumb>
  )
}

export default Breadcrumbs
