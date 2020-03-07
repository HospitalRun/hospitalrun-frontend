import React, { CSSProperties } from 'react'
import { List, ListItem, Icon } from '@hospitalrun/components'
import { useTranslation } from 'react-i18next'
import { useLocation, useHistory } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store'
import { updateSidebar } from './component-slice'

const Sidebar = () => {
  const dispatch = useDispatch()
  const { sidebarCollapsed } = useSelector((state: RootState) => state.components)

  const { t } = useTranslation()
  const path = useLocation()
  const history = useHistory()
  const { pathname } = path

  const navigateTo = (location: string) => {
    history.push(location)
  }

  const listItemStyle: CSSProperties = {
    cursor: 'pointer',
  }

  return (
    <nav
      className="col-md-2 d-none d-md-block bg-light sidebar"
      style={{ width: sidebarCollapsed ? '56px' : '' }}
    >
      <div className="sidebar-sticky">
        <List layout="flush" className="nav flex-column">
          <ListItem
            onClick={() => dispatch(updateSidebar())}
            className="nav-item"
            style={listItemStyle}
          >
            <Icon
              style={{ float: sidebarCollapsed ? 'left' : 'right' }}
              icon={sidebarCollapsed ? 'right-arrow' : 'left-arrow'}
            />
          </ListItem>
          <ListItem
            active={pathname === '/'}
            onClick={() => navigateTo('/')}
            className="nav-item"
            style={listItemStyle}
          >
            <Icon icon="dashboard" /> {!sidebarCollapsed && t('dashboard.label')}
          </ListItem>
          <ListItem
            active={pathname.split('/')[1].includes('patient')}
            onClick={() => navigateTo('/patients')}
            className="nav-item"
            style={listItemStyle}
          >
            <Icon icon="patients" /> {!sidebarCollapsed && t('patients.label')}
          </ListItem>
          <ListItem
            active={pathname.split('/')[1].includes('appointments')}
            onClick={() => navigateTo('/appointments')}
            className="nav-item"
            style={listItemStyle}
          >
            <Icon icon="appointment" /> {!sidebarCollapsed && t('scheduling.label')}
          </ListItem>
        </List>
      </div>
    </nav>
  )
}

export default Sidebar
