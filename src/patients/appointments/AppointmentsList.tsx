import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router'
import { useTranslation } from 'react-i18next'
import { TextInput, Button, List, ListItem, Container, Row } from '@hospitalrun/components'
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
      <div className="row">
        <div className="col-md-12 d-flex justify-content-end">
          <Button
            outlined
            color="success"
            icon="add"
            iconLocation="left"
            onClick={() => history.push('/appointments/new')}
          >
            {t('patient.appointments.new')}
          </Button>
        </div>
      </div>
      <br />
      <form className="form-inline" onSubmit={onSearchFormSubmit}>
        <div className="input-group" style={{ width: '100%' }}>
          <TextInput
            size="lg"
            value={searchText}
            placeholder={t('actions.search')}
            onChange={onSearchBoxChange}
          />
          <div className="input-group-append">
            <Button onClick={onSearchFormSubmit}>{t('actions.search')}</Button>
          </div>
        </div>
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
