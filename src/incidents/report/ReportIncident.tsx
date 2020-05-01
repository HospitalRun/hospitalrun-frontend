import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Row, Column } from '@hospitalrun/components'
import { useHistory } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import useTitle from '../../page-header/useTitle'
import useAddBreadcrumbs from '../../breadcrumbs/useAddBreadcrumbs'
import DateTimePickerWithLabelFormGroup from '../../components/input/DateTimePickerWithLabelFormGroup'
import TextFieldWithLabelFormGroup from '../../components/input/TextFieldWithLabelFormGroup'
import TextInputWithLabelFormGroup from '../../components/input/TextInputWithLabelFormGroup'
import { reportIncident } from '../incident-slice'
import Incident from '../../model/Incident'
import { RootState } from '../../store'

const ReportIncident = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { t } = useTranslation()
  useTitle(t('incidents.reports.new'))
  const breadcrumbs = [
    {
      i18nKey: 'incidents.reports.new',
      location: `/incidents/new`,
    },
  ]
  useAddBreadcrumbs(breadcrumbs)

  const { error } = useSelector((root: RootState) => root.incident)
  const [incident, setIncident] = useState({
    date: new Date().toISOString(),
    department: '',
    category: '',
    categoryItem: '',
    description: '',
  })

  const onDateChange = (newDate: Date) => {
    setIncident((prevState) => ({
      ...prevState,
      date: newDate.toISOString(),
    }))
  }

  const onTextInputChange = (text: string, name: string) => {
    setIncident((prevState) => ({
      ...prevState,
      [name]: text,
    }))
  }

  const onSave = () => {
    const onSuccess = (newIncident: Incident) => {
      history.push(`/incidents/${newIncident.id}`)
    }

    dispatch(reportIncident(incident as Incident, onSuccess))
  }

  const onCancel = () => {
    history.push('/incidents')
  }

  return (
    <form>
      <Row>
        <Column md={6}>
          <DateTimePickerWithLabelFormGroup
            name="dateOfIncident"
            label={t('incidents.reports.dateOfIncident')}
            isEditable
            isRequired
            onChange={onDateChange}
            value={new Date(incident.date)}
            isInvalid={!!error?.date}
            feedback={t(error?.date as string)}
          />
        </Column>
        <Column md={6}>
          <TextInputWithLabelFormGroup
            label={t('incidents.reports.department')}
            name="department"
            isRequired
            isEditable
            value={incident.department}
            onChange={(event) => onTextInputChange(event.currentTarget.value, 'department')}
            isInvalid={!!error?.department}
            feedback={t(error?.department as string)}
          />
        </Column>
      </Row>
      <Row>
        <Column md={6}>
          <TextInputWithLabelFormGroup
            name="category"
            label={t('incidents.reports.category')}
            isEditable
            isRequired
            value={incident.category}
            onChange={(event) => onTextInputChange(event.currentTarget.value, 'category')}
            isInvalid={!!error?.category}
            feedback={t(error?.category as string)}
          />
        </Column>
        <Column md={6}>
          <TextInputWithLabelFormGroup
            label={t('incidents.reports.categoryItem')}
            name="categoryItem"
            isRequired
            isEditable
            value={incident.categoryItem}
            onChange={(event) => onTextInputChange(event.currentTarget.value, 'categoryItem')}
            isInvalid={!!error?.categoryItem}
            feedback={t(error?.categoryItem as string)}
          />
        </Column>
      </Row>
      <Row>
        <Column md={12}>
          <TextFieldWithLabelFormGroup
            label={t('incidents.reports.description')}
            name="description"
            isRequired
            isEditable
            value={incident.description}
            onChange={(event) => onTextInputChange(event.currentTarget.value, 'description')}
            isInvalid={!!error?.description}
            feedback={t(error?.description as string)}
          />
        </Column>
      </Row>

      <div className="row float-right">
        <div className="btn-group btn-group-lg mt-3">
          <Button className="mr-2" color="success" onClick={onSave}>
            {t('incidents.actions.report')}
          </Button>
          <Button color="danger" onClick={onCancel}>
            {t('actions.cancel')}
          </Button>
        </div>
      </div>
    </form>
  )
}

export default ReportIncident
