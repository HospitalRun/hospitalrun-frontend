import { Button, Column, Row, Spinner } from '@hospitalrun/components'
import format from 'date-fns/format'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'

import usePatient from '../../patients/hooks/usePatient'
import TextFieldWithLabelFormGroup from '../../shared/components/input/TextFieldWithLabelFormGroup'
import TextInputWithLabelFormGroup from '../../shared/components/input/TextInputWithLabelFormGroup'
import useTranslator from '../../shared/hooks/useTranslator'
import Incident from '../../shared/model/Incident'
import Permissions from '../../shared/model/Permissions'
import { extractUsername } from '../../shared/util/extractUsername'
import useIncident from '../hooks/useIncident'
import useUpdateIncident from '../hooks/useUpdateIncident'

interface Props {
  incidentId: string
  permissions: (Permissions | null)[]
}

function ViewIncidentDetails(props: Props) {
  const { incidentId, permissions } = props
  const history = useHistory()
  const { t } = useTranslator()
  const { data, isLoading } = useIncident(incidentId)
  const [incident, setIncident] = useState<Incident | undefined>(data)

  const { data: patient } = usePatient(incident?.patient)
  const [mutate] = useUpdateIncident()

  useEffect(() => {
    setIncident(data)
  }, [data, isLoading])

  if (incident === undefined || isLoading) {
    return <Spinner type="DotLoader" loading />
  }

  const onResolve = async () => {
    await mutate({ ...incident, status: 'resolved' })
    history.push('/incidents')
  }
  const onUpdate = async () => {
    await mutate({ ...incident, status: 'reported' })
    history.push('/incidents')
  }
  const getButtons = () => {
    const buttons: React.ReactNode[] = []
    if (incident.status === 'resolved') {
      return buttons
    }
    if (permissions.includes(Permissions.ResolveIncident)) {
      buttons.push(
        <Button className="mr-2" color="success" onClick={onUpdate} key="incidents.reports.update">
          {t('incidents.reports.update')}
        </Button>,
        <Button
          onClick={onResolve}
          className="mr-2"
          color="primary"
          key="incidents.reports.resolve"
        >
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
  const onIncidentChange = (key: keyof Incident) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const incidentCopy = { ...incident }
    if (incidentCopy?.hasOwnProperty(key)) {
      if (key === 'status') {
        incidentCopy[key] = e.target.value as 'reported' | 'resolved'
      } else {
        incidentCopy[key] = e.target.value as string
      }

      setIncident(incidentCopy)
    }
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
            isEditable
            onChange={onIncidentChange('department')}
          />
        </Column>
      </Row>
      <Row>
        <Column md={6}>
          <TextInputWithLabelFormGroup
            name="category"
            label={t('incidents.reports.category')}
            value={incident.category}
            isEditable
            onChange={onIncidentChange('category')}
          />
        </Column>
        <Column md={6}>
          <TextInputWithLabelFormGroup
            label={t('incidents.reports.categoryItem')}
            name="categoryItem"
            value={incident.categoryItem}
            isEditable
            onChange={onIncidentChange('categoryItem')}
          />
        </Column>
      </Row>
      <Row>
        <Column md={12}>
          <TextFieldWithLabelFormGroup
            label={t('incidents.reports.description')}
            name="description"
            value={incident.description}
            isEditable
            onChange={onIncidentChange('description')}
          />
        </Column>
      </Row>
      {incident.patient && (
        <Row>
          <Column md={6}>
            <TextInputWithLabelFormGroup
              label={t('incidents.reports.patient')}
              name="patient"
              value={patient?.fullName}
              isEditable
              onChange={onIncidentChange('patient')}
            />
          </Column>
        </Row>
      )}
      {incident.resolvedOn === undefined && (
        <div className="row float-right">
          <div className="btn-group btn-group-lg mt-3 mr-3">{getButtons()}</div>
        </div>
      )}
    </>
  )
}

export default ViewIncidentDetails
