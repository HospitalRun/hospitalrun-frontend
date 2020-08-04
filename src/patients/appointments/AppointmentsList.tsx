import { Button, Container, Row, Table } from '@hospitalrun/components'
import format from 'date-fns/format'
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import useAddBreadcrumbs from '../../page-header/breadcrumbs/useAddBreadcrumbs'
import { fetchPatientAppointments } from '../../scheduling/appointments/appointments-slice'
import useTranslator from '../../shared/hooks/useTranslator'
import { RootState } from '../../shared/store'

interface Props {
  patientId: string
}

const AppointmentsList = (props: Props) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { t } = useTranslator()

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

  const table = (
    <Table
      data={appointments}
      getID={(row) => row.id}
      onRowClick={(row) => history.push(`/appointments/${row.id}`)}
      columns={[
        {
          label: t('scheduling.appointment.startDate'),
          key: 'startDateTime',
          formatter: (row) =>
            row.startDateTime ? format(new Date(row.startDateTime), 'yyyy-MM-dd, hh:mm a') : '',
        },
        {
          label: t('scheduling.appointment.endDate'),
          key: 'endDateTime',
          formatter: (row) =>
            row.endDateTime ? format(new Date(row.endDateTime), 'yyyy-MM-dd, hh:mm a') : '',
        },
        { label: t('scheduling.appointment.location'), key: 'location' },
        { label: t('scheduling.appointment.type'), key: 'type' },
      ]}
    />
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
        <Row>{table}</Row>
      </Container>
    </>
  )
}

export default AppointmentsList
