import { Button, Table, Alert } from '@hospitalrun/components'
import format from 'date-fns/format'
import React from 'react'
import { useHistory } from 'react-router-dom'

import useAddBreadcrumbs from '../../page-header/breadcrumbs/useAddBreadcrumbs'
import Loading from '../../shared/components/Loading'
import useTranslator from '../../shared/hooks/useTranslator'
import Patient from '../../shared/model/Patient'
import usePatientsAppointments from '../hooks/usePatientAppointments'

interface Props {
  patient: Patient
}

const AppointmentsList = ({ patient }: Props) => {
  const history = useHistory()
  const { t } = useTranslator()
  const patientId = patient.id

  const { data, status } = usePatientsAppointments(patientId)

  const breadcrumbs = [
    {
      i18nKey: 'scheduling.appointments.label',
      location: `/patients/${patientId}/appointments`,
    },
  ]

  useAddBreadcrumbs(breadcrumbs)

  if (data === undefined || status === 'loading') {
    return <Loading />
  }

  return (
    <>
      <div className="row">
        <div className="col-md-12 d-flex justify-content-end">
          <Button
            key="newAppointmentButton"
            outlined
            color="success"
            icon="appointment-add"
            onClick={() => history.push({ pathname: '/appointments/new', state: { patient } })}
          >
            {t('scheduling.appointments.new')}
          </Button>
        </div>
      </div>
      <br />
      <div className="row">
        <div className="col-md-12">
          {data.length > 0 ? (
            <Table
              data={data}
              getID={(row) => row.id}
              onRowClick={(row) => history.push(`/appointments/${row.id}`)}
              columns={[
                {
                  label: t('scheduling.appointment.startDate'),
                  key: 'startDateTime',
                  formatter: (row) =>
                    row.startDateTime
                      ? format(new Date(row.startDateTime), 'yyyy-MM-dd, hh:mm a')
                      : '',
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
              actionsHeaderText={t('actions.label')}
              actions={[
                {
                  label: t('actions.view'),
                  action: (row) => history.push(`/appointments/${row.id}`),
                },
              ]}
            />
          ) : (
            <Alert
              color="warning"
              title={t('patient.appointments.warning.noAppointments')}
              message={t('patient.appointments.addAppointmentAbove')}
            />
          )}
        </div>
      </div>
    </>
  )
}

export default AppointmentsList
