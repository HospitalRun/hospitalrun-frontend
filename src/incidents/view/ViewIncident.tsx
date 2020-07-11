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
import { extractUsername } from '../../shared/util/extractUsername'
import { fetchIncident, resolveIncident } from '../incident-slice'

const ViewIncident = () => {
  const dispatch = useDispatch()
  const { t } = useTranslator()
  const history = useHistory()
  const { id } = useParams()
  const { incident } = useSelector((state: RootState) => state.incident)
  const { permissions } = useSelector((state: RootState) => state.user)
  const isUnresolved = incident?.status !== 'resolved'
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
      dispatch(resolveIncident(incident, onSuccess))
    }
  }

  const getButtons = () => {
    const buttons: React.ReactNode[] = []
    if (incident?.status === 'resolved') {
      return buttons
    }

    if (permissions.includes(Permissions.ResolveIncident)) {
      buttons.push(
        <Button
          className="mr-2"
          onClick={onComplete}
          color="primary"
          key="incidents.reports.resolve"
        >
          {t('incidents.reports.resolve')}
        </Button>,
      )
    }

    return buttons
  }

  if (incident) {
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
        {isUnresolved && (
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
