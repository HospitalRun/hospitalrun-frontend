import { Button, Column, Row, Spinner } from '@hospitalrun/components'
import format from 'date-fns/format'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'

import useAddBreadcrumbs from '../../page-header/breadcrumbs/useAddBreadcrumbs'
import useTitle from '../../page-header/title/useTitle'
import TextFieldWithLabelFormGroup from '../../shared/components/input/TextFieldWithLabelFormGroup'
import TextInputWithLabelFormGroup from '../../shared/components/input/TextInputWithLabelFormGroup'
import useTranslator from '../../shared/hooks/useTranslator'
import Permissions from '../../shared/model/Permissions'
import { RootState } from '../../shared/store'
import { fetchIncident, completeIncident } from '../incident-slice'
import { extractUsername } from '../util/extractUsername'

const ViewIncident = () => {
  const dispatch = useDispatch()
  const { t } = useTranslator()
  const history = useHistory()
  const { id } = useParams()
  const { incident } = useSelector((state: RootState) => state.incident)
  const { permissions } = useSelector((state: RootState) => state.user)
  const isIncomplete = incident?.status !== 'completed'
  useTitle(incident ? incident.code : '')
  const breadcrumbs = [
    {
      i18nKey: incident ? incident.code : '',
      location: `/incidents/${id}`,
    },
  ]
  useAddBreadcrumbs(breadcrumbs)

  useEffect(() => {
    if (id) {
      dispatch(fetchIncident(id))
    }
  }, [dispatch, id])

  const onComplete = async () => {
    const onSuccess = () => {
      history.push('/incidents')
    }

    if (incident) {
      dispatch(completeIncident(incident, onSuccess))
    }
  }

  const getButtons = () => {
    const buttons: React.ReactNode[] = []
    if (incident?.status === 'completed') {
      return buttons
    }

    if (permissions.includes(Permissions.CompleteIncident)) {
      buttons.push(
        <Button
          className="mr-2"
          onClick={onComplete}
          color="primary"
          key="incidents.reports.complete"
        >
          {t('incidents.reports.complete')}
        </Button>,
      )
    }

    return buttons
  }

  if (incident) {
    const getCompletedOnDate = () => {
      if (incident.status === 'completed' && incident.completedOn) {
        return (
          <Column>
            <div className="form-group completed-on">
              <h4>{t('incidents.reports.completedOn')}</h4>
              <h5>{format(new Date(incident.completedOn), 'yyyy-MM-dd hh:mm a')}</h5>
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
          {getCompletedOnDate()}
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
        {isIncomplete && (
          <div className="row float-right">
            <div className="btn-group btn-group-lg mt-3">{getButtons()}</div>
          </div>
        )}
      </>
    )
  }
  return <Spinner type="BarLoader" loading />
}

export default ViewIncident
