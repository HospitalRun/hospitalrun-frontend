import { Button, Column, Row, Spinner } from '@hospitalrun/components'
import format from 'date-fns/format'
import React from 'react'
import { useSelector } from 'react-redux'

import useAddBreadcrumbs from '../../page-header/breadcrumbs/useAddBreadcrumbs'
import useTitle from '../../page-header/title/useTitle'
import TextFieldWithLabelFormGroup from '../../shared/components/input/TextFieldWithLabelFormGroup'
import TextInputWithLabelFormGroup from '../../shared/components/input/TextInputWithLabelFormGroup'
import useTranslator from '../../shared/hooks/useTranslator'
import Permissions from '../../shared/model/Permissions'
import { RootState } from '../../shared/store'
import { extractUsername } from '../../shared/util/extractUsername'
import useIncident from '../hooks/useIncident'
import useResolveIncident from '../hooks/useResolveIncident'

interface Props {
  incidentId: string
}

function ViewIncidentDetails(props: Props) {
  const { incidentId } = props
  const { t } = useTranslator()
  const { data, isLoading } = useIncident(incidentId)
  const [mutate] = useResolveIncident()
  useTitle(data ? data.code : '')
  useAddBreadcrumbs([
    {
      i18nKey: data ? data.code : '',
      location: `/incidents/${data}`,
    },
  ])
  const { permissions } = useSelector((state: RootState) => state.user)

  if (data === undefined || isLoading) {
    return <Spinner type="DotLoader" loading />
  }

  const onComplete = async () => {
    await mutate(data)
  }

  const getButtons = () => {
    const buttons: React.ReactNode[] = []
    if (data.status === 'resolved') {
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

  const getResolvedOnDate = () => {
    if (data.status === 'resolved' && data.resolvedOn) {
      return (
        <Column>
          <div className="form-group incident-resolved-on">
            <h4>{t('incidents.reports.resolvedOn')}</h4>
            <h5>{format(new Date(data.resolvedOn), 'yyyy-MM-dd hh:mm a')}</h5>
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
            <h5>{format(new Date(data.date || ''), 'yyyy-MM-dd hh:mm a')}</h5>
          </div>
        </Column>
        <Column>
          <div className="form-group incident-status">
            <h4>{t('incidents.reports.status')}</h4>
            <h5>{data.status}</h5>
          </div>
        </Column>
        <Column>
          <div className="form-group incident-reported-by">
            <h4>{t('incidents.reports.reportedBy')}</h4>
            <h5>{extractUsername(data.reportedBy)}</h5>
          </div>
        </Column>
        <Column>
          <div className="form-group incident-reported-on">
            <h4>{t('incidents.reports.reportedOn')}</h4>
            <h5>{format(new Date(data.reportedOn || ''), 'yyyy-MM-dd hh:mm a')}</h5>
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
            value={data.department}
          />
        </Column>
      </Row>
      <Row>
        <Column md={6}>
          <TextInputWithLabelFormGroup
            name="category"
            label={t('incidents.reports.category')}
            value={data.category}
          />
        </Column>
        <Column md={6}>
          <TextInputWithLabelFormGroup
            label={t('incidents.reports.categoryItem')}
            name="categoryItem"
            value={data.categoryItem}
          />
        </Column>
      </Row>
      <Row>
        <Column md={12}>
          <TextFieldWithLabelFormGroup
            label={t('incidents.reports.description')}
            name="description"
            value={data.description}
          />
        </Column>
      </Row>
      {data.resolvedOn === undefined && (
        <div className="row float-right">
          <div className="btn-group btn-group-lg mt-3">{getButtons()}</div>
        </div>
      )}
    </>
  )
}

export default ViewIncidentDetails
