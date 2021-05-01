import { Column, Row, Spinner } from '@hospitalrun/components'
import format from 'date-fns/format'
import React from 'react'

import usePatient from '../../patients/hooks/usePatient'
import TextFieldWithLabelFormGroup from '../../shared/components/input/TextFieldWithLabelFormGroup'
import TextInputWithLabelFormGroup from '../../shared/components/input/TextInputWithLabelFormGroup'
import useTranslator from '../../shared/hooks/useTranslator'
import Incident from '../../shared/model/Incident'
import { extractUsername } from '../../shared/util/extractUsername'
interface Props {
  incident?: Incident
  isLoading: boolean
}

function ViewIncidentDetails(props: Props) {
  const { incident, isLoading } = props
  const { t } = useTranslator()
  const { data, isLoading } = useIncident(incidentId)
  const { data: patient } = usePatient(data?.patient)
  const [mutate] = useResolveIncident()

  if (incident === undefined || isLoading) {
    return <Spinner type="DotLoader" loading />
  }

  const onResolve = async () => {
    await mutate(data)
    history.push('/incidents')
  }

  const getButtons = () => {
    const buttons: React.ReactNode[] = []
    if (data.status === 'resolved') {
      return buttons
    }

    if (permissions.includes(Permissions.ResolveIncident)) {
      buttons.push(
        <Button onClick={onResolve} color="primary" key="incidents.reports.resolve">
          {t('incidents.reports.resolve')}
        </Button>,
      )
    }

    return buttons
  }

  const getResolvedOnDate = () => {
    if (incident.status === 'resolved' && incident.resolvedOn) {
      return (
        <Column>
          <div className="form-group incident-resolved-on">
            <h4>{t('incidents.reports.resolvedOn')}</h4>
            <h5>{format(new Date(incident.resolvedOn), 'yyyy-MM-dd hh:mm a')}</h5>
          </div>
        </Column>
      )
    }
    return <></>
  }

  return (
    <>
      <Row>
        <Column>
          <div className="form-group incident-date">
            <h4>{t('incidents.reports.dateOfIncident')}</h4>
            <h5>{format(new Date(incident.date || ''), 'yyyy-MM-dd hh:mm a')}</h5>
          </div>
        </Column>
        <Column>
          <div className="form-group incident-status">
            <h4>{t('incidents.reports.status')}</h4>
            <h5>{incident.status}</h5>
          </div>
        </Column>
        <Column>
          <div className="form-group incident-reported-by">
            <h4>{t('incidents.reports.reportedBy')}</h4>
            <h5>{extractUsername(incident.reportedBy)}</h5>
          </div>
        </Column>
        <Column>
          <div className="form-group incident-reported-on">
            <h4>{t('incidents.reports.reportedOn')}</h4>
            <h5>{format(new Date(incident.reportedOn || ''), 'yyyy-MM-dd hh:mm a')}</h5>
          </div>
        </Column>
        {getResolvedOnDate()}
      </Row>
      <div className="border-bottom mb-2" />
      <Row>
        <Column md={12}>
          <TextInputWithLabelFormGroup
            label={t('incidents.reports.department')}
            name="department"
            value={incident.department}
          />
        </Column>
      </Row>
      <Row>
        <Column md={6}>
          <TextInputWithLabelFormGroup
            name="category"
            label={t('incidents.reports.category')}
            value={incident.category}
          />
        </Column>
        <Column md={6}>
          <TextInputWithLabelFormGroup
            label={t('incidents.reports.categoryItem')}
            name="categoryItem"
            value={incident.categoryItem}
          />
        </Column>
      </Row>
      <Row>
        <Column md={12}>
          <TextFieldWithLabelFormGroup
            label={t('incidents.reports.description')}
            name="description"
            value={incident.description}
          />
        </Column>
      </Row>
      {data.patient && (
        <Row>
          <Column md={6}>
            <TextInputWithLabelFormGroup
              label={t('incidents.reports.patient')}
              name="patient"
              value={patient?.fullName}
            />
          </Column>
        </Row>
      )}
      {data.resolvedOn === undefined && (
        <div className="row float-right">
          <div className="btn-group btn-group-lg mt-3 mr-3">{getButtons()}</div>
        </div>
      )}
    </>
  )
}

export default ViewIncidentDetails
