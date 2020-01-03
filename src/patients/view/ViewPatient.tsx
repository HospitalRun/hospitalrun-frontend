import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, withRouter } from 'react-router-dom'
import { Panel, Spinner } from '@hospitalrun/components'
import { useTranslation } from 'react-i18next'
import { differenceInYears } from 'date-fns'
import useTitle from '../../util/useTitle'
import { fetchPatient } from '../patient-slice'
import { RootState } from '../../store'
import TextFieldWithLabelFormGroup from '../../components/input/TextFieldWithLabelFormGroup'
import TextInputWithLabelFormGroup from '../../components/input/TextInputWithLabelFormGroup'
import SelectWithLabelFormGroup from '../../components/input/SelectWithLableFormGroup'
import Patient from '../../model/Patient'
import DatePickerWithLabelFormGroup from '../../components/input/DatePickerWithLabelFormGroup'

const getNamePartString = (namePart: string | undefined) => {
  if (!namePart) {
    return ''
  }

  return namePart
}

const getPatientAge = (dateOfBirth: string | undefined): string => {
  if (!dateOfBirth) {
    return ''
  }

  const dob = new Date(dateOfBirth)
  return differenceInYears(new Date(), dob).toString()
}

const getPatientDateOfBirth = (dateOfBirth: string | undefined): Date | undefined => {
  if (!dateOfBirth) {
    return undefined
  }

  return new Date(dateOfBirth)
}

const formatPatientName = (patient: Patient) => {
  if (!patient) {
    return ''
  }

  // eslint-disable-next-line
  return `${getNamePartString(patient.givenName)} ${getNamePartString(patient.familyName)} ${getNamePartString(patient.suffix)}`
}

const ViewPatient = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { patient } = useSelector((state: RootState) => state.patient)
  useTitle(formatPatientName(patient))

  const { id } = useParams()
  useEffect(() => {
    if (id) {
      dispatch(fetchPatient(id))
    }
  }, [dispatch, id])

  if (!patient) {
    return <Spinner color="blue" loading size={[10, 25]} type="ScaleLoader" />
  }

  return (
    <div>
      <Panel title={t('patient.basicInformation')} color="primary" collapsible>
        <div className="row">
          <div className="col">
            <SelectWithLabelFormGroup
              name="sex"
              label={t('patient.sex')}
              value={patient.sex}
              isEditable={false}
              options={[
                { label: t('sex.male'), value: 'male' },
                { label: t('sex.female'), value: 'female' },
                { label: t('sex.other'), value: 'other' },
                { label: t('sex.unknown'), value: 'unknown' },
              ]}
            />
          </div>
          <div className="col">
            <SelectWithLabelFormGroup
              name="type"
              label={t('patient.type')}
              value={patient.type}
              isEditable={false}
              options={[
                { label: t('patient.types.charity'), value: 'charity' },
                { label: t('patient.types.private'), value: 'private' },
              ]}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <TextInputWithLabelFormGroup
              label={
                patient.isApproximateDateOfBirth ? t('patient.approximateAge') : t('patient.age')
              }
              name="age"
              value={getPatientAge(patient.dateOfBirth)}
              isEditable={false}
            />
          </div>
          <div className="col-md-6">
            <DatePickerWithLabelFormGroup
              label={
                patient.isApproximateDateOfBirth
                  ? t('patient.approximateDateOfBirth')
                  : t('patient.dateOfBirth')
              }
              name="dateOfBirth"
              value={getPatientDateOfBirth(patient.dateOfBirth)}
              isEditable={false}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <TextInputWithLabelFormGroup
              label={t('patient.occupation')}
              name="occupation"
              value={patient.occupation}
              isEditable={false}
            />
          </div>
          <div className="col-md-6">
            <TextInputWithLabelFormGroup
              label={t('patient.preferredLanguage')}
              name="preferredLanguage"
              value={patient.preferredLanguage}
              isEditable={false}
            />
          </div>
        </div>
      </Panel>
      <br />
      <Panel title={t('patient.contactInformation')} color="primary" collapsible>
        <div className="row">
          <div className="col">
            <TextInputWithLabelFormGroup
              label={t('patient.phoneNumber')}
              name="phoneNumber"
              value={patient.phoneNumber}
              isEditable={false}
            />
          </div>
          <div className="col">
            <TextInputWithLabelFormGroup
              label={t('patient.email')}
              placeholder="email@email.com"
              name="email"
              value={patient.email}
              isEditable={false}
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <TextFieldWithLabelFormGroup
              label={t('patient.address')}
              name="address"
              value={patient.address}
              isEditable={false}
            />
          </div>
        </div>
      </Panel>
    </div>
  )
}

export default withRouter(ViewPatient)
