import { Button, List, ListItem, Container, Row } from '@hospitalrun/components'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import useAddBreadcrumbs from '../../breadcrumbs/useAddBreadcrumbs'
import { fetchPatientAppointments } from '../../scheduling/appointments/appointments-slice'
import { RootState } from '../../store'

interface Props {
  patientId: string
}

const AppointmentsList = (props: Props) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { t } = useTranslation()

  const { patientId } = props
  const { appointments } = useSelector((state: RootState) => state.appointments)

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

  return (
    <>
      <div className="row">
        <div className="col-md-12 d-flex justify-content-end">
          <Button
            key="newAppointmentButton"
            outlined
            color="success"
            icon="appointment-add"
            onClick={() => history.push('/appointments/new')}
          >
            {t('scheduling.appointments.new')}
          </Button>
        </div>
      </div>
      <br />
      <Container>
        <Row>
          <List layout="flush" style={{ width: '100%', marginTop: '10px', marginLeft: '-25px' }}>
            {list}
          </List>
        </Row>
      </Container>
    </>
  )
}

export default AppointmentsList
