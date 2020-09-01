import { Navbar as HospitalRunNavbar } from '@hospitalrun/components'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { logout } from '../../../user/user-slice'
import useTranslator from '../../hooks/useTranslator'
import { RootState } from '../../store'
import pageMap, { Page } from './pageMap'

const Navbar = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { t } = useTranslator()
  const { permissions, user } = useSelector((state: RootState) => state.user)

  const navigateTo = (location: string) => {
    history.push(location)
  }

  const dividerAboveLabels = [
    'scheduling.appointments.new',
    'labs.requests.new',
    'medications.requests.new',
    'incidents.reports.new',
    'imagings.requests.new',
    'settings.label',
  ]

  function getDropdownListOfPages(pages: Page[]) {
    return pages
      .filter((page) => !page.permission || permissions.includes(page.permission))
      .map((page) => ({
        type: 'link',
        label: t(page.label),
        icon: `${page.icon}`,
        onClick: () => {
          navigateTo(page.path)
        },
        dividerAbove: dividerAboveLabels.includes(page.label),
      }))
  }

  // For Mobile, hamburger menu
  const hambergerPages = Object.keys(pageMap).map((key) => pageMap[key])

  // For Desktop, add shortcuts menu
  const addPages = [
    pageMap.newPatient,
    pageMap.newAppointment,
    pageMap.newMedication,
    pageMap.newLab,
    pageMap.newImaging,
    pageMap.newIncident,
  ]

  return (
    <HospitalRunNavbar
      bg="dark"
      variant="dark"
      navItems={[
        {
          name: 'menu',
          size: 'lg',
          type: 'link-list-icon',
          children: getDropdownListOfPages(hambergerPages),
          label: '',
          className: 'nav-hamberger pr-4 d-md-none',
        },
        {
          type: 'image',
          src:
            'data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53%0D%0AMy5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5r%0D%0AIiB2aWV3Qm94PSIwIDAgMjk5IDI5OSI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOnVybCgjbGlu%0D%0AZWFyLWdyYWRpZW50KTt9PC9zdHlsZT48bGluZWFyR3JhZGllbnQgaWQ9ImxpbmVhci1ncmFkaWVu%0D%0AdCIgeDE9IjcyLjU4IiB5MT0iMTYuMDQiIHgyPSIyMjcuMzEiIHkyPSIyODQuMDIiIGdyYWRpZW50%0D%0AVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48c3RvcCBvZmZzZXQ9IjAuMDEiIHN0b3AtY29sb3I9IiM2%0D%0AMGQxYmIiLz48c3RvcCBvZmZzZXQ9IjAuNSIgc3RvcC1jb2xvcj0iIzFhYmM5YyIvPjxzdG9wIG9m%0D%0AZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAwOWI5ZSIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjx0%0D%0AaXRsZT5jcm9zcy1pY29uPC90aXRsZT48cGF0aCBpZD0iY3Jvc3MiIGNsYXNzPSJjbHMtMSIgZD0i%0D%0ATTI5Mi45NCw5Ny40NkgyMDUuM1Y3LjA2QTYuNTYsNi41NiwwLDAsMCwxOTguNzQuNUgxMDEuMjZB%0D%0ANi41Niw2LjU2LDAsMCwwLDk0LjcsNy4wNnY5MC40SDcuMDZBNi41OCw2LjU4LDAsMCwwLC41LDEw%0D%0ANFYxOTYuM2E2LjIzLDYuMjMsMCwwLDAsNi4yMyw2LjI0aDg4djkwLjRhNi41Niw2LjU2LDAsMCww%0D%0ALDYuNTYsNi41Nmg5Ny40OGE2LjU2LDYuNTYsMCwwLDAsNi41Ni02LjU2di05MC40aDg4YTYuMjMs%0D%0ANi4yMywwLDAsMCw2LjIzLTYuMjRWMTA0QTYuNTgsNi41OCwwLDAsMCwyOTIuOTQsOTcuNDZaIiB0%0D%0AcmFuc2Zvcm09InRyYW5zbGF0ZSgtMC41IC0wLjUpIi8+PC9zdmc+',
          onClick: () => {
            navigateTo('/')
          },
          className: 'nav-icon',
        },
        {
          type: 'header',
          label: 'HospitalRun',
          onClick: () => {
            navigateTo('/')
          },
          className: 'nav-header',
        },
        {
          type: 'link-list-icon',
          alignRight: true,
          children: getDropdownListOfPages(addPages),
          className: 'ml-auto nav-add-new d-none d-md-block',
          iconClassName: 'align-bottom',
          label: 'Add',
          name: 'add',
          size: 'lg',
        },
        {
          type: 'link-list-icon',
          alignRight: true,
          children: [
            {
              type: 'link',
              label: `${t('user.login.currentlySignedInAs')} ${user?.givenName} ${
                user?.familyName
              }`,
              onClick: () => {
                navigateTo('/settings')
              },
            },
            {
              type: 'link',
              label: t('settings.label'),
              onClick: () => {
                navigateTo('/settings')
              },
            },
            {
              type: 'link',
              label: t('actions.logout'),
              onClick: () => {
                dispatch(logout())
                navigateTo('/login')
              },
            },
          ],
          className: 'pl-2 d-none d-md-block nav-account',
          iconClassName: 'align-bottom',
          label: 'Patient',
          name: 'patient',
          size: 'lg',
        },
      ]}
    />
  )
}
export default Navbar
