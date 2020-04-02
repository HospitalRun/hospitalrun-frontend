import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router'
import format from 'date-fns/format'
import LabRepository from 'clients/db/LabRepository'
import Lab from 'model/Lab'
import Patient from 'model/Patient'
import PatientRepository from 'clients/db/PatientRepository'
import useTitle from 'page-header/useTitle'
import { useTranslation } from 'react-i18next'
import { Row, Column, Badge, Button, Alert } from '@hospitalrun/components'
import TextFieldWithLabelFormGroup from 'components/input/TextFieldWithLabelFormGroup'
import { useButtonToolbarSetter } from 'page-header/ButtonBarProvider'
import useAddBreadcrumbs from 'breadcrumbs/useAddBreadcrumbs'
import { useSelector } from 'react-redux'
import Permissions from 'model/Permissions'
import { RootState } from '../store'

const getTitle = (patient: Patient | undefined, lab: Lab | undefined) =>
  patient && lab ? `${lab.type} for ${patient.fullName}` : ''

const ViewLab = () => {
  const { id } = useParams()
  const { t } = useTranslation()
  const history = useHistory()
  const setButtons = useButtonToolbarSetter()

  const { permissions } = useSelector((state: RootState) => state.user)
  const [patient, setPatient] = useState<Patient | undefined>()
  const [lab, setLab] = useState<Lab | undefined>()
  const [isEditable, setIsEditable] = useState<boolean>(true)
  const [isResultInvalid, setIsResultInvalid] = useState<boolean>(false)
  const [resultFeedback, setResultFeedback] = useState()
  const [errorMessage, setErrorMessage] = useState()

  useTitle(getTitle(patient, lab))

  const breadcrumbs = [
    {
      i18nKey: 'labs.requests.view',
      location: `/labs/${lab?.id}`,
    },
  ]
  useAddBreadcrumbs(breadcrumbs)

  useEffect(() => {
    const fetchLab = async () => {
      if (id) {
        const fetchedLab = await LabRepository.find(id)
        setLab(fetchedLab)
        setIsEditable(fetchedLab.status === 'requested')
      }
    }
    fetchLab()
  }, [id])

  useEffect(() => {
    const fetchPatient = async () => {
      if (lab) {
        const fetchedPatient = await PatientRepository.find(lab.patientId)
        setPatient(fetchedPatient)
      }
    }

    fetchPatient()
  }, [lab])

  const onResultChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const result = event.currentTarget.value
    const newLab = lab as Lab
    setLab({ ...newLab, result })
  }

  const onNotesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const notes = event.currentTarget.value
    const newLab = lab as Lab
    setLab({ ...newLab, notes })
  }

  const onUpdate = async () => {
    await LabRepository.saveOrUpdate(lab as Lab)
    history.push('/labs')
  }

  const onComplete = async () => {
    const newLab = lab as Lab

    if (!newLab.result) {
      setIsResultInvalid(true)
      setResultFeedback(t('labs.requests.error.resultRequiredToComplete'))
      setErrorMessage(t('labs.requests.error.unableToComplete'))
      return
    }

    await LabRepository.saveOrUpdate({
      ...newLab,
      completedOn: new Date().toISOString(),
      status: 'completed',
    })
    history.push('/labs')
  }

  const onCancel = async () => {
    const newLab = lab as Lab
    await LabRepository.saveOrUpdate({
      ...newLab,
      canceledOn: new Date().toISOString(),
      status: 'canceled',
    })
    history.push('/labs')
  }

  const getButtons = () => {
    const buttons: React.ReactNode[] = []
    if (lab?.status === 'completed' || lab?.status === 'canceled') {
      return buttons
    }

    if (permissions.includes(Permissions.CompleteLab)) {
      buttons.push(
        <Button onClick={onComplete} color="primary">
          {t('labs.requests.complete')}
        </Button>,
      )
    }

    if (permissions.includes(Permissions.CancelLab)) {
      buttons.push(
        <Button onClick={onCancel} color="danger">
          {t('labs.requests.cancel')}
        </Button>,
      )
    }

    return buttons
  }

  setButtons(getButtons())

  if (lab && patient) {
    const getBadgeColor = () => {
      if (lab.status === 'completed') {
        return 'primary'
      }
      if (lab.status === 'canceled') {
        return 'danger'
      }
      return 'warning'
    }

    const getCanceledOnOrCompletedOnDate = () => {
      if (lab.status === 'completed' && lab.completedOn) {
        return (
          <Column>
            <div className="form-group completed-on">
              <h4>{t('labs.lab.completedOn')}</h4>
              <h5>{format(new Date(lab.completedOn), 'yyyy-MM-dd hh:mm a')}</h5>
            </div>
          </Column>
        )
      }
      if (lab.status === 'canceled' && lab.canceledOn) {
        return (
          <Column>
            <div className="form-group canceled-on">
              <h4>{t('labs.lab.canceledOn')}</h4>
              <h5>{format(new Date(lab.canceledOn), 'yyyy-MM-dd hh:mm a')}</h5>
            </div>
          </Column>
        )
      }
      return <></>
    }

    return (
      <>
        {isResultInvalid && (
          <Alert color="danger" title={t('states.error')} message={errorMessage} />
        )}
        <Row>
          <Column>
            <div className="form-group lab-status">
              <h4>{t('labs.lab.status')}</h4>
              <Badge color={getBadgeColor()}>
                <h5>{lab.status}</h5>
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
              <h5>{lab.type}</h5>
            </div>
          </Column>
          <Column>
            <div className="form-group requested-on">
              <h4>{t('labs.lab.requestedOn')}</h4>
              <h5>{format(new Date(lab.requestedOn), 'yyyy-MM-dd hh:mm a')}</h5>
            </div>
          </Column>
          {getCanceledOnOrCompletedOnDate()}
        </Row>
        <div className="border-bottom" />
        <form>
          <TextFieldWithLabelFormGroup
            name="result"
            label={t('labs.lab.result')}
            value={lab.result}
            isEditable={isEditable}
            isInvalid={isResultInvalid}
            feedback={resultFeedback}
            onChange={onResultChange}
          />
          <TextFieldWithLabelFormGroup
            name="notes"
            label={t('labs.lab.notes')}
            value={lab.notes}
            isEditable={isEditable}
            onChange={onNotesChange}
          />
          {isEditable && (
            <div className="row float-right">
              <div className="btn-group btn-group-lg mt-3">
                <Button className="mr-2" color="success" onClick={onUpdate}>
                  {t('actions.update')}
                </Button>
              </div>
            </div>
          )}
        </form>
      </>
    )
  }
  return <h1>Loading...</h1>
}

export default ViewLab
