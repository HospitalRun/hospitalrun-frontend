import { Modal, Column, Row } from '@hospitalrun/components'
import { addMonths } from 'date-fns'
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import DatePickerWithLabelFormGroup from '../../components/input/DatePickerWithLabelFormGroup'
import SelectWithLabelFormGroup from '../../components/input/SelectWithLableFormGroup'
import TextFieldWithLabelFormGroup from '../../components/input/TextFieldWithLabelFormGroup'
import TextInputWithLabelFormGroup from '../../components/input/TextInputWithLabelFormGroup'
import CarePlan, { CarePlanIntent, CarePlanStatus } from '../../model/CarePlan'
import { RootState } from '../../store'
import { addCarePlan } from '../patient-slice'

interface Props {
  show: boolean
  onCloseButtonClick: () => void
}

const initialCarePlanState = {
  title: '',
  description: '',
  startDate: new Date().toISOString(),
  endDate: addMonths(new Date(), 1).toISOString(),
  note: '',
  intent: '',
  status: '',
  diagnosisId: '',
}

const AddCarePlanModal = (props: Props) => {
  const { show, onCloseButtonClick } = props
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { carePlanError, patient } = useSelector((state: RootState) => state.patient)
  const [carePlan, setCarePlan] = useState(initialCarePlanState)

  useEffect(() => {
    setCarePlan(initialCarePlanState)
  }, [show])

  const onFieldChange = (name: string, value: string) => {
    setCarePlan((previousCarePlan) => ({
      ...previousCarePlan,
      [name]: value,
    }))
  }

  const onSaveButtonClick = () => {
    dispatch(addCarePlan(patient.id, carePlan as CarePlan))
  }

  const onClose = () => {
    onCloseButtonClick()
  }

  const body = (
    <>
      <form>
        <Row>
          <Column sm={12}>
            <TextInputWithLabelFormGroup
              isRequired
              value={carePlan.title}
              label={t('patient.carePlan.title')}
              name="title"
              feedback={carePlanError?.title}
              isInvalid={!!carePlanError?.title}
              isEditable
              onChange={(event) => onFieldChange('title', event.currentTarget.value)}
            />
          </Column>
        </Row>
        <Row>
          <Column sm={12}>
            <TextFieldWithLabelFormGroup
              isRequired
              value={carePlan.description}
              label={t('patient.carePlan.description')}
              name="title"
              feedback={carePlanError?.description}
              isInvalid={!!carePlanError?.description}
              isEditable
              onChange={(event) => onFieldChange('description', event.currentTarget.value)}
            />
          </Column>
        </Row>
        <Row>
          <Column sm={12}>
            <SelectWithLabelFormGroup
              isRequired
              value={carePlan.diagnosisId}
              label={t('patient.carePlan.condition')}
              name="title"
              feedback={carePlanError?.condition}
              isInvalid={!!carePlanError?.condition}
              isEditable
              onChange={(event) => onFieldChange('diagnosisId', event.currentTarget.value)}
              options={patient.diagnoses?.map((d) => ({ label: d.name, value: d.id })) || []}
            />
          </Column>
        </Row>
        <Row>
          <Column sm={6}>
            <SelectWithLabelFormGroup
              isRequired
              value={carePlan.status}
              label={t('patient.carePlangi.condition')}
              name="status"
              feedback={carePlanError?.status}
              isInvalid={!!carePlanError?.status}
              isEditable
              options={Object.values(CarePlanStatus).map((v) => ({ label: v, value: v }))}
              onChange={(event) => onFieldChange('status', event.currentTarget.value)}
            />
          </Column>
          <Column sm={6}>
            <SelectWithLabelFormGroup
              isRequired
              value={carePlan.intent}
              label={t('patient.carePlan.intent')}
              name="intent"
              feedback={carePlanError?.intent}
              isInvalid={!!carePlanError?.intent}
              isEditable
              options={Object.values(CarePlanIntent).map((v) => ({ label: v, value: v }))}
              onChange={(event) => onFieldChange('intent', event.currentTarget.value)}
            />
          </Column>
        </Row>
        <Row>
          <Column sm={6}>
            <DatePickerWithLabelFormGroup
              isRequired
              value={carePlan.startDate ? new Date(carePlan.startDate) : new Date()}
              label={t('patient.carePlan.startDate')}
              name="startDate"
              feedback={carePlanError?.startDate}
              isInvalid={!!carePlanError?.startDate}
              isEditable
              onChange={(date) => onFieldChange('startDate', date.toISOString())}
            />
          </Column>
          <Column sm={6}>
            <DatePickerWithLabelFormGroup
              isRequired
              value={carePlan.endDate ? new Date(carePlan.endDate) : new Date()}
              label={t('patient.carePlan.endDate')}
              name="endDate"
              feedback={carePlanError?.endDate}
              isInvalid={!!carePlanError?.endDate}
              isEditable
              onChange={(date) => onFieldChange('endDate', date.toISOString())}
            />
          </Column>
        </Row>
        <Row>
          <Column sm={12}>
            <TextFieldWithLabelFormGroup
              isRequired
              value={carePlan.note}
              label={t('patient.carePlan.note')}
              name="note"
              feedback={carePlanError?.note}
              isInvalid={!!carePlanError?.note}
              isEditable
              onChange={(event) => onFieldChange('note', event.currentTarget.value)}
            />
          </Column>
        </Row>
      </form>
    </>
  )

  return (
    <Modal
      show={show}
      toggle={onClose}
      title={t('patient.carePlan.new')}
      body={body}
      closeButton={{
        children: t('actions.cancel'),
        color: 'danger',
        onClick: onClose,
      }}
      successButton={{
        children: t('patient.carePlan.new'),
        color: 'success',
        icon: 'add',
        iconLocation: 'left',
        onClick: onSaveButtonClick,
      }}
    />
  )
}

export default AddCarePlanModal
