import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Icon } from '@hospitalrun/components'
import { useTranslation } from 'react-i18next'

const Sidebar = () => {
  const { t } = useTranslation()
  const path = useLocation()
  return (
    <nav className="col-md-2 d-none d-md-block bg-light sidebar">
      <div className="sidebar-sticky">
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link to="/" className={`nav-link ${path.pathname === '/' ? ' active' : ''}`}>
              {t('dashboard.label', 'dashboard')}
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/patients"
              className={`nav-link ${path.pathname.includes('patient') ? ' active' : ''}`}
            >
              <Icon icon="patients" />
              {`  ${t('patients.label', 'patients')}`}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Sidebar
