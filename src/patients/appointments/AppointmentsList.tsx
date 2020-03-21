import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router'
import { useTranslation } from 'react-i18next'
import { TextInput, Button, List, ListItem, Container, Row, Column } from '@hospitalrun/components'
import { RootState } from '../../store'
import { fetchPatientAppointments } from '../../scheduling/appointments/appointments-slice'
import useAddBreadcrumbs from '../../breadcrumbs/useAddBreadcrumbs'

interface Props {
  patientId: string
}

const AppointmentsList = (props: Props) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { t } = useTranslation()

  const { patientId } = props
  const { appointments } = useSelector((state: RootState) => state.appointments)
  const [searchText, setSearchText] = useState<string>('')

  const breadcrumbs = [
    {
      i18nKey: 'scheduling.appointments.label',
      location: `/patients/${patientId}/appointments`,
    },
  ]
  useAddBreadcrumbs(breadcrumbs)

  useEffect(() => {
    dispatch(fetchPatientAppointments(patientId))
  }, [dispatch, patientId])

  const list = (
    // inline style added to pick up on newlines for string literal
    <ul style={{ whiteSpace: 'pre-line' }}>
      {appointments.map((a) => (
        <ListItem action key={a.id} onClick={() => history.push(`/appointments/${a.id}`)}>
          {new Date(a.startDateTime).toLocaleString()}
        </ListItem>
      ))}
    </ul>
  )

  const onSearchBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value)
  }

  const onSearchFormSubmit = (event: React.FormEvent | React.MouseEvent) => {
    event.preventDefault()
    dispatch(fetchPatientAppointments(patientId, searchText))
  }

  return (
    <Container>
      <form className="form" onSubmit={onSearchFormSubmit}>
        <Row>
          <Column md={10}>
            <TextInput
              size="lg"
              type="text"
              onChange={onSearchBoxChange}
              value={searchText}
              placeholder={t('actions.search')}
            />
          </Column>
          <Column md={2}>
            <Button size="large" onClick={onSearchFormSubmit}>
              {t('actions.search')}
            </Button>
          </Column>
        </Row>
      </form>

      <Row>
        <List layout="flush" style={{ width: '100%', marginTop: '10px', marginLeft: '-25px' }}>
          {list}
        </List>
      </Row>
    </Container>
  )
}

export default AppointmentsList
