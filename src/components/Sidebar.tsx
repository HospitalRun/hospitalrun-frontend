import React, { useState, CSSProperties } from 'react'
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
  const splittedPath = pathname.split('/')

  const navigateTo = (location: string) => {
    history.push(location)
  }

  const listItemStyle: CSSProperties = {
    cursor: 'pointer',
  }

  const expandibleArrow: CSSProperties = {
    marginRight: '20px',
  }

  const iconMargin: CSSProperties = {
    marginRight: '10px',
  }

  const [expandedItem, setExpandedItem] = useState(
    splittedPath[1].includes('patients')
      ? 'patient'
      : splittedPath[1].includes('appointments')
      ? 'appointment'
      : 'none',
  )

  const setExpansion = (item: string) => {
    if (expandedItem === item) {
      setExpandedItem('none')
      return
    }

    setExpandedItem(item.toString())
  }

  const listSubItemStyleNew: CSSProperties = {
    cursor: 'pointer',
    fontSize: 'small',
    borderBottomWidth: 0,
    color:
      (splittedPath[1].includes('patients') || splittedPath[1].includes('appointments')) &&
      splittedPath.length > 2
        ? 'white'
        : 'black',
  }

  const listSubItemStyle: CSSProperties = {
    cursor: 'pointer',
    fontSize: 'small',
    borderBottomWidth: 0,
    color:
      (splittedPath[1].includes('patients') || splittedPath[1].includes('appointments')) &&
      splittedPath.length < 3
        ? 'white'
        : 'black',
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
            onClick={() => {
              navigateTo('/')
              setExpansion('none')
            }}
            className="nav-item"
            style={listItemStyle}
          >
            <Icon icon="dashboard" /> {!sidebarCollapsed && t('dashboard.label')}
          </ListItem>
          <ListItem
            active={splittedPath[1].includes('patient')}
            onClick={() => {
              navigateTo('/patients')
              if (expandedItem === 'patient') {
                setExpandedItem('none')
                return
              }

              setExpandedItem('patient')
            }}
            className="nav-item"
            style={listItemStyle}
          >
            <Icon
              icon={
                splittedPath[1].includes('patient') && expandedItem === 'patient'
                  ? 'down-arrow'
                  : 'right-arrow'
              }
              style={expandibleArrow}
            />
            <Icon icon="patients" /> {!sidebarCollapsed && t('patients.label')}
          </ListItem>
          {splittedPath[1].includes('patient') && expandedItem === 'patient' && (
            <List layout="flush">
              <ListItem
                className="nav-item"
                style={listSubItemStyleNew}
                onClick={() => navigateTo('/patients/new')}
                active={splittedPath[1].includes('patients') && splittedPath.length > 2}
              >
                <Icon icon="patient-add" style={iconMargin} />
                {!sidebarCollapsed && t('patients.newPatient')}
              </ListItem>
              <ListItem
                className="nav-item"
                style={listSubItemStyle}
                onClick={() => navigateTo('/patients')}
                active={splittedPath[1].includes('patients') && splittedPath.length < 3}
              >
                <Icon icon="incident" style={iconMargin} />
                {!sidebarCollapsed && t('patients.patientsList')}
              </ListItem>
            </List>
          )}
          <ListItem
            active={splittedPath[1].includes('appointments')}
            onClick={() => {
              navigateTo('/appointments')
              setExpansion('appointment')
            }}
            className="nav-item"
            style={listItemStyle}
          >
            <Icon
              icon={
                splittedPath[1].includes('appointments') && expandedItem === 'appointment'
                  ? 'down-arrow'
                  : 'right-arrow'
              }
              style={expandibleArrow}
            />
            <Icon icon="appointment" /> {!sidebarCollapsed && t('scheduling.label')}
          </ListItem>
          {splittedPath[1].includes('appointment') && expandedItem === 'appointment' && (
            <List layout="flush" className="nav flex-column">
              <ListItem
                className="nav-item"
                style={listSubItemStyleNew}
                onClick={() => navigateTo('/appointments/new')}
                active={splittedPath[1].includes('appointments') && splittedPath.length > 2}
              >
                <Icon icon="appointment-add" style={iconMargin} />
                {!sidebarCollapsed && t('scheduling.appointments.new')}
              </ListItem>
              <ListItem
                className="nav-item"
                style={listSubItemStyle}
                onClick={() => navigateTo('/appointments')}
                active={splittedPath[1].includes('appointments') && splittedPath.length < 3}
              >
                <Icon icon="incident" style={iconMargin} />
                {!sidebarCollapsed && t('scheduling.appointments.schedule')}
              </ListItem>
            </List>
          )}
        </List>
      </div>
    </nav>
  )
}

export default Sidebar
