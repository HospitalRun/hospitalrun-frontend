import { Row, Column, Badge, Button, Alert } from '@hospitalrun/components'
import format from 'date-fns/format'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useHistory } from 'react-router'

import useAddBreadcrumbs from '../breadcrumbs/useAddBreadcrumbs'
import TextFieldWithLabelFormGroup from '../components/input/TextFieldWithLabelFormGroup'
import Lab from '../model/Lab'
import Patient from '../model/Patient'
import Permissions from '../model/Permissions'
import useTitle from '../page-header/useTitle'
import { RootState } from '../store'
import { cancelLab, completeLab, updateLab, fetchLab } from './lab-slice'

const getTitle = (patient: Patient | undefined, lab: Lab | undefined) =>
  patient && lab ? `${lab.type} for ${patient.fullName}(${lab.code})` : ''

const ViewLab = () => {
  const { id } = useParams()
  const { t } = useTranslation()
  const history = useHistory()
  const dispatch = useDispatch()
  const { permissions } = useSelector((state: RootState) => state.user)
  const { lab, patient, status, error } = useSelector((state: RootState) => state.lab)

  const [labToView, setLabToView] = useState<Lab>()
  const [isEditable, setIsEditable] = useState<boolean>(true)

  useTitle(getTitle(patient, labToView))

  const breadcrumbs = [
    {
      i18nKey: 'labs.requests.view',
      location: `/labs/${labToView?.id}`,
    },
  ]
  useAddBreadcrumbs(breadcrumbs)

  useEffect(() => {
    if (id) {
      dispatch(fetchLab(id))
    }
  }, [id, dispatch])

  useEffect(() => {
    if (lab) {
      setLabToView({ ...lab })
      setIsEditable(lab.status === 'requested')
    }
  }, [lab])

  const onResultChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const result = event.currentTarget.value
    const newLab = labToView as Lab
    setLabToView({ ...newLab, result })
  }

  const onNotesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const notes = event.currentTarget.value
    const newLab = labToView as Lab
    setLabToView({ ...newLab, notes })
  }

  const onUpdate = async () => {
    const onSuccess = () => {
      history.push('/labs')
    }
    if (labToView) {
      dispatch(updateLab(labToView, onSuccess))
    }
  }

  const onComplete = async () => {
    const onSuccess = () => {
      history.push('/labs')
    }

    if (labToView) {
      dispatch(completeLab(labToView, onSuccess))
    }
  }

  const onCancel = async () => {
    const onSuccess = () => {
      history.push('/labs')
    }

    if (labToView) {
      dispatch(cancelLab(labToView, onSuccess))
    }
  }

  const getButtons = () => {
    const buttons: React.ReactNode[] = []
    if (labToView?.status === 'completed' || labToView?.status === 'canceled') {
      return buttons
    }

    buttons.push(
      <Button className="mr-2" color="success" onClick={onUpdate} key="actions.update">
        {t('actions.update')}
      </Button>,
    )

    if (permissions.includes(Permissions.CompleteLab)) {
      buttons.push(
        <Button className="mr-2" onClick={onComplete} color="primary" key="labs.requests.complete">
          {t('labs.requests.complete')}
        </Button>,
      )
    }

    if (permissions.includes(Permissions.CancelLab)) {
      buttons.push(
        <Button onClick={onCancel} color="danger" key="labs.requests.cancel">
          {t('labs.requests.cancel')}
        </Button>,
      )
    }

    return buttons
  }

  if (labToView && patient) {
    const getBadgeColor = () => {
      if (labToView.status === 'completed') {
        return 'primary'
      }
      if (labToView.status === 'canceled') {
        return 'danger'
      }
      return 'warning'
    }

    const getCanceledOnOrCompletedOnDate = () => {
      if (labToView.status === 'completed' && labToView.completedOn) {
        return (
          <Column>
            <div className="form-group completed-on">
              <h4>{t('labs.lab.completedOn')}</h4>
              <h5>{format(new Date(labToView.completedOn), 'yyyy-MM-dd hh:mm a')}</h5>
            </div>
          </Column>
        )
      }
      if (labToView.status === 'canceled' && labToView.canceledOn) {
        return (
          <Column>
            <div className="form-group canceled-on">
              <h4>{t('labs.lab.canceledOn')}</h4>
              <h5>{format(new Date(labToView.canceledOn), 'yyyy-MM-dd hh:mm a')}</h5>
            </div>
          </Column>
        )
      }
      return <></>
    }

    return (
      <>
        {status === 'error' && (
          <Alert color="danger" title={t('states.error')} message={t(error.message || '')} />
        )}
        <Row>
          <Column>
            <div className="form-group lab-status">
              <h4>{t('labs.lab.status')}</h4>
              <Badge color={getBadgeColor()}>
                <h5>{labToView.status}</h5>
              </Badge>
            </div>
          </Column>
          <Column>
            <div className="form-group for-patient">
              <h4>{t('labs.lab.for')}</h4>
              <h5>{patient.fullName}</h5>
            </div>
          </Column>
          <Column>
            <div className="form-group lab-type">
              <h4>{t('labs.lab.type')}</h4>
              <h5>{labToView.type}</h5>
            </div>
          </Column>
          <Column>
            <div className="form-group requested-on">
              <h4>{t('labs.lab.requestedOn')}</h4>
              <h5>{format(new Date(labToView.requestedOn), 'yyyy-MM-dd hh:mm a')}</h5>
            </div>
          </Column>
          {getCanceledOnOrCompletedOnDate()}
        </Row>
        <div className="border-bottom" />
        <form>
          <TextFieldWithLabelFormGroup
            name="result"
            label={t('labs.lab.result')}
            value={labToView.result}
            isEditable={isEditable}
            isInvalid={!!error.result}
            feedback={t(error.result as string)}
            onChange={onResultChange}
          />
          <TextFieldWithLabelFormGroup
            name="notes"
            label={t('labs.lab.notes')}
            value={labToView.notes}
            isEditable={isEditable}
            onChange={onNotesChange}
          />
          {isEditable && (
            <div className="row float-right">
              <div className="btn-group btn-group-lg mt-3">{getButtons()}</div>
            </div>
          )}
        </form>
      </>
    )
  }
  return <h1>Loading...</h1>
}

export default ViewLab
