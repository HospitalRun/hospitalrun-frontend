import { List, ListItem, Icon } from '@hospitalrun/components'
import React, { useState, CSSProperties } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation, useHistory } from 'react-router-dom'

import useTranslator from '../hooks/useTranslator'
import Permissions from '../model/Permissions'
import { RootState } from '../store'
import { updateSidebar } from './component-slice'

const Sidebar = () => {
  const dispatch = useDispatch()
  const { sidebarCollapsed } = useSelector((state: RootState) => state.components)
  const permissions = useSelector((state: RootState) => state.user.permissions)

  const { t } = useTranslator()
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
      : splittedPath[1].includes('labs')
      ? 'labs'
      : splittedPath[1].includes('medications')
      ? 'medications'
      : splittedPath[1].includes('incidents')
      ? 'incidents'
      : splittedPath[1].includes('imagings')
      ? 'imagings'
      : 'none',
  )

  const setExpansion = (item: string) => {
    if (expandedItem === item) {
      setExpandedItem('none')
      return
    }

    setExpandedItem(item.toString())
  }

  const listSubItemStyle: CSSProperties = {
    cursor: 'pointer',
    fontSize: 'small',
    borderBottomWidth: 0,
    borderTopWidth: 0,
    color: 'black',
    padding: '.6rem 1.25rem',
    backgroundColor: 'rgba(245,245,245,1)',
  }

  const listSubItemStyleNew: CSSProperties = {
    cursor: 'pointer',
    fontSize: 'small',
    borderBottomWidth: 0,
    borderTopWidth: 0,
    color: 'black',
    padding: '.6rem 1.25rem',
    backgroundColor: 'rgba(245,245,245,1)',
  }

  const getDashboardLink = () => (
    <>
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
    </>
  )

  const getPatientLinks = () => (
    <>
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
          {permissions.includes(Permissions.WritePatients) && (
            <ListItem
              className="nav-item"
              style={listSubItemStyleNew}
              onClick={() => navigateTo('/patients/new')}
              active={splittedPath[1].includes('patients') && splittedPath.length > 2}
            >
              <Icon icon="patient-add" style={iconMargin} />
              {!sidebarCollapsed && t('patients.newPatient')}
            </ListItem>
          )}
          {permissions.includes(Permissions.ReadPatients) && (
            <ListItem
              className="nav-item"
              style={listSubItemStyle}
              onClick={() => navigateTo('/patients')}
              active={splittedPath[1].includes('patients') && splittedPath.length < 3}
            >
              <Icon icon="incident" style={iconMargin} />
              {!sidebarCollapsed && t('patients.patientsList')}
            </ListItem>
          )}
        </List>
      )}
    </>
  )

  const getAppointmentLinks = () => (
    <>
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
          {permissions.includes(Permissions.WriteAppointments) && (
            <ListItem
              className="nav-item"
              style={listSubItemStyleNew}
              onClick={() => navigateTo('/appointments/new')}
              active={splittedPath[1].includes('appointments') && splittedPath.length > 2}
            >
              <Icon icon="appointment-add" style={iconMargin} />
              {!sidebarCollapsed && t('scheduling.appointments.new')}
            </ListItem>
          )}
          {permissions.includes(Permissions.ReadAppointments) && (
            <ListItem
              className="nav-item"
              style={listSubItemStyle}
              onClick={() => navigateTo('/appointments')}
              active={splittedPath[1].includes('appointments') && splittedPath.length < 3}
            >
              <Icon icon="incident" style={iconMargin} />
              {!sidebarCollapsed && t('scheduling.appointments.schedule')}
            </ListItem>
          )}
        </List>
      )}
    </>
  )

  const getLabLinks = () => (
    <>
      <ListItem
        active={splittedPath[1].includes('labs')}
        onClick={() => {
          navigateTo('/labs')
          setExpansion('labs')
        }}
        className="nav-item"
        style={listItemStyle}
      >
        <Icon
          icon={
            splittedPath[1].includes('labs') && expandedItem === 'labs'
              ? 'down-arrow'
              : 'right-arrow'
          }
          style={expandibleArrow}
        />
        <Icon icon="lab" /> {!sidebarCollapsed && t('labs.label')}
      </ListItem>
      {splittedPath[1].includes('labs') && expandedItem === 'labs' && (
        <List layout="flush" className="nav flex-column">
          {permissions.includes(Permissions.RequestLab) && (
            <ListItem
              className="nav-item"
              style={listSubItemStyleNew}
              onClick={() => navigateTo('/labs/new')}
              active={splittedPath[1].includes('labs') && splittedPath.length > 2}
            >
              <Icon icon="add" style={iconMargin} />
              {!sidebarCollapsed && t('labs.requests.new')}
            </ListItem>
          )}
          {permissions.includes(Permissions.ViewLabs) && (
            <ListItem
              className="nav-item"
              style={listSubItemStyle}
              onClick={() => navigateTo('/labs')}
              active={splittedPath[1].includes('labs') && splittedPath.length < 3}
            >
              <Icon icon="incident" style={iconMargin} />
              {!sidebarCollapsed && t('labs.requests.label')}
            </ListItem>
          )}
        </List>
      )}
    </>
  )

  const getMedicationLinks = () => (
    <>
      <ListItem
        active={splittedPath[1].includes('medications')}
        onClick={() => {
          navigateTo('/medications')
          setExpansion('medications')
        }}
        className="nav-item"
        style={listItemStyle}
      >
        <Icon
          icon={
            splittedPath[1].includes('medications') && expandedItem === 'medications'
              ? 'down-arrow'
              : 'right-arrow'
          }
          style={expandibleArrow}
        />
        <Icon icon="medication" /> {!sidebarCollapsed && t('medications.label')}
      </ListItem>
      {splittedPath[1].includes('medications') && expandedItem === 'medications' && (
        <List layout="flush" className="nav flex-column">
          {permissions.includes(Permissions.RequestMedication) && (
            <ListItem
              className="nav-item"
              style={listSubItemStyleNew}
              onClick={() => navigateTo('/medications/new')}
              active={splittedPath[1].includes('medications') && splittedPath.length > 2}
            >
              <Icon icon="add" style={iconMargin} />
              {!sidebarCollapsed && t('medications.requests.new')}
            </ListItem>
          )}
          {permissions.includes(Permissions.ViewMedications) && (
            <ListItem
              className="nav-item"
              style={listSubItemStyle}
              onClick={() => navigateTo('/medications')}
              active={splittedPath[1].includes('medications') && splittedPath.length < 3}
            >
              <Icon icon="incident" style={iconMargin} />
              {!sidebarCollapsed && t('medications.requests.label')}
            </ListItem>
          )}
        </List>
      )}
    </>
  )

  const getIncidentLinks = () => (
    <>
      <ListItem
        active={splittedPath[1].includes('incidents')}
        onClick={() => {
          navigateTo('/incidents')
          setExpansion('incidents')
        }}
        className="nav-item"
        style={listItemStyle}
      >
        <Icon
          icon={
            splittedPath[1].includes('incidents') && expandedItem === 'incidents'
              ? 'down-arrow'
              : 'right-arrow'
          }
          style={expandibleArrow}
        />
        <Icon icon="incident" /> {!sidebarCollapsed && t('incidents.label')}
      </ListItem>
      {splittedPath[1].includes('incidents') && expandedItem === 'incidents' && (
        <List layout="flush" className="nav flex-column">
          {permissions.includes(Permissions.ReportIncident) && (
            <ListItem
              className="nav-item"
              style={listSubItemStyleNew}
              onClick={() => navigateTo('/incidents/new')}
              active={splittedPath[1].includes('incidents') && splittedPath.length > 2}
            >
              <Icon icon="add" style={iconMargin} />
              {!sidebarCollapsed && t('incidents.reports.new')}
            </ListItem>
          )}
          {permissions.includes(Permissions.ViewIncidents) && (
            <ListItem
              className="nav-item"
              style={listSubItemStyle}
              onClick={() => navigateTo('/incidents')}
              active={splittedPath[1].includes('incidents') && splittedPath.length < 3}
            >
              <Icon icon="incident" style={iconMargin} />
              {!sidebarCollapsed && t('incidents.reports.label')}
            </ListItem>
          )}
          {permissions.includes(Permissions.ViewIncidentWidgets) && (
            <ListItem
              className="nav-item"
              style={listSubItemStyle}
              onClick={() => navigateTo('/incidents/visualize')}
              active={splittedPath[1].includes('incidents') && splittedPath.length < 3}
            >
              <Icon icon="incident" style={iconMargin} />
              {!sidebarCollapsed && t('incidents.visualize.label')}
            </ListItem>
          )}
        </List>
      )}
    </>
  )

  const getImagingLinks = () => (
    <>
      <ListItem
        active={splittedPath[1].includes('imaging')}
        onClick={() => {
          navigateTo('/imaging')
          setExpansion('imagings')
        }}
        className="nav-item"
        style={listItemStyle}
      >
        <Icon
          icon={
            splittedPath[1].includes('imaging') && expandedItem === 'imagings'
              ? 'down-arrow'
              : 'right-arrow'
          }
          style={expandibleArrow}
        />
        <Icon icon="image" /> {!sidebarCollapsed && t('imagings.label')}
      </ListItem>
      {splittedPath[1].includes('imaging') && expandedItem === 'imagings' && (
        <List layout="flush" className="nav flex-column">
          {permissions.includes(Permissions.RequestImaging) && (
            <ListItem
              className="nav-item"
              style={listSubItemStyleNew}
              onClick={() => navigateTo('/imaging/new')}
              active={splittedPath[1].includes('imaging') && splittedPath.length > 2}
            >
              <Icon icon="add" style={iconMargin} />
              {!sidebarCollapsed && t('imagings.requests.new')}
            </ListItem>
          )}
          {permissions.includes(Permissions.ViewImagings) && (
            <ListItem
              className="nav-item"
              style={listSubItemStyle}
              onClick={() => navigateTo('/imaging')}
              active={splittedPath[1].includes('imaging') && splittedPath.length < 3}
            >
              <Icon icon="image" style={iconMargin} />
              {!sidebarCollapsed && t('imagings.requests.label')}
            </ListItem>
          )}
        </List>
      )}
    </>
  )

  return (
    <nav
      className="d-none d-md-block bg-light sidebar"
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
          {getDashboardLink()}
          {getPatientLinks()}
          {getAppointmentLinks()}
          {getMedicationLinks()}
          {getLabLinks()}
          {getImagingLinks()}
          {getIncidentLinks()}
        </List>
      </div>
    </nav>
  )
}

export default Sidebar
