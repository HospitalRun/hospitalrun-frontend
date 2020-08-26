import { Panel, Container, Row, Table, Button, Typography } from '@hospitalrun/components'
import format from 'date-fns/format'
import React, { CSSProperties, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'

import useTranslator from '../../shared/hooks/useTranslator'
import Allergy from '../../shared/model/Allergy'
import Diagnosis from '../../shared/model/Diagnosis'
import Patient from '../../shared/model/Patient'
import Permissions from '../../shared/model/Permissions'
import { RootState } from '../../shared/store'
import NewAllergyModal from '../allergies/NewAllergyModal'
import AddCarePlanModal from '../care-plans/AddCarePlanModal'
import AddDiagnosisModal from '../diagnoses/AddDiagnosisModal'
import AddVisitModal from '../visits/AddVisitModal'
// import  {getPatientFullName} from '../util/patient-name-util'

interface Props {
  patient: Patient
}

const getPatientCode = (p: Patient): string => {
  if (p) {
    return p.code
  }

  return ''
}

const ImportantPatientInfo = (props: Props) => {
  const { patient } = props
  const { t } = useTranslator()
  const history = useHistory()
  const { permissions } = useSelector((state: RootState) => state.user)
  const [showNewAllergyModal, setShowNewAllergyModal] = useState(false)
  const [showDiagnosisModal, setShowDiagnosisModal] = useState(false)
  const [showAddCarePlanModal, setShowAddCarePlanModal] = useState(false)
  const [showAddVisitModal, setShowAddVisitModal] = useState(false)

  const patientCodeStyle: CSSProperties = {
    position: 'relative',
    color: 'black',
    backgroundColor: 'rgba(245,245,245,1)',
    fontSize: 'small',
    textAlign: 'center',
  }

  const allergiesSectionStyle: CSSProperties = {
    position: 'relative',
    color: 'black',
    backgroundColor: 'rgba(245,245,245,1)',
    fontSize: 'small',
  }

  const tableStyle: CSSProperties = {
    position: 'relative',
    marginLeft: '2px',
    marginRight: '2px',
    fontSize: 'small',
  }

  const addAllergyButtonStyle: CSSProperties = {
    fontSize: 'small',
    position: 'absolute',
    top: '0px',
    right: '0px',
  }

  return (
    <div>
      <Panel collapsible title="Brief Patient Information">
        <Container>
          <Row>
            <div className="col-2">
              <h3>{patient.fullName}</h3>
            </div>
            <div className="col-2">
              <div style={patientCodeStyle}>
                <strong>{t('patient.code')}</strong>
                <h6>{getPatientCode(patient)}</h6>
              </div>
            </div>
            <div className="col d-flex justify-content-end">
              {permissions.includes(Permissions.AddVisit) && (
                <Button
                  outlined
                  color="success"
                  icon="add"
                  iconLocation="left"
                  onClick={() => setShowAddVisitModal(true)}
                >
                  {t('patient.visits.new')}
                </Button>
              )}
            </div>
          </Row>
          <Row>
            <div className="col">
              <div className="patient-sex">
                <strong>{t('patient.sex')}</strong>
                <h6>{patient.sex}</h6>
              </div>
              <div className="patient-dateOfBirth">
                <strong>{t('patient.dateOfBirth')}</strong>
                <h6>
                  {patient.dateOfBirth
                    ? format(new Date(patient.dateOfBirth), 'MM/dd/yyyy')
                    : t('patient.unknownDateOfBirth')}
                </h6>
              </div>
              {/* <Row>
                  <strong>Sex</strong>
                </Row>
                <Row>{patient.sex}</Row>
                <Row>
                  <strong>DateOfBirth</strong>
                </Row>
                <Row>
                  {patient.dateOfBirth
                    ? format(new Date(patient.dateOfBirth), 'MM/dd/yyyy')
                    : 'Unknown'}
                </Row> */}
              <br />

              <div style={allergiesSectionStyle}>
                <Typography variant="h5">{t('patient.allergies.label')}</Typography>
                {patient.allergies ? (
                  patient.allergies?.map((a: Allergy) => (
                    <li key={a.id.toString()}>
                      <Link to={`/patients/${patient.id}/allergies`}>{a.name}</Link>
                    </li>
                  ))
                ) : (
                  <></>
                )}
                {permissions.includes(Permissions.AddAllergy) && (
                  <Button
                    style={addAllergyButtonStyle}
                    color="primary"
                    icon="add"
                    outlined
                    iconLocation="left"
                    onClick={() => setShowNewAllergyModal(true)}
                  >
                    {t('patient.allergies.new')}
                  </Button>
                )}
              </div>
            </div>

            <div className="col diagnoses-section">
              <Typography variant="h5">{t('patient.diagnoses.label')}</Typography>
              <div className="border border-primary" style={tableStyle}>
                <Table
                  getID={(row) => row.id}
                  columns={[
                    { label: t('patient.diagnoses.diagnosisName'), key: 'name' },
                    {
                      label: t('patient.diagnoses.diagnosisDate'),
                      key: 'diagnosisDate',
                      formatter: (row) =>
                        row.diagnosisDate
                          ? format(new Date(row.diagnosisDate), 'yyyy-MM-dd hh:mm a')
                          : '',
                    },
                  ]}
                  data={patient.diagnoses ? (patient.diagnoses as Diagnosis[]) : []}
                />
              </div>
              {permissions.includes(Permissions.AddDiagnosis) && (
                <Button
                  color="light"
                  icon="add"
                  iconLocation="left"
                  onClick={() => setShowDiagnosisModal(true)}
                >
                  {t('patient.diagnoses.new')}
                </Button>
              )}
            </div>
            <div className="col carePlan-section">
              <Typography variant="h5">{t('patient.carePlan.label')}</Typography>
              <div className="border border-primary" style={tableStyle}>
                {/* <CarePlanTable /> */}
                <Table
                  onRowClick={(row) => history.push(`/patients/${patient.id}/care-plans/${row.id}`)}
                  getID={(row) => row.id}
                  data={patient.carePlans || []}
                  columns={[
                    { label: t('patient.carePlan.title'), key: 'title' },
                    {
                      label: t('patient.carePlan.startDate'),
                      key: 'startDate',
                      formatter: (row) => format(new Date(row.startDate), 'yyyy-MM-dd'),
                    },
                    {
                      label: t('patient.carePlan.endDate'),
                      key: 'endDate',
                      formatter: (row) => format(new Date(row.endDate), 'yyyy-MM-dd'),
                    },
                    { label: t('patient.carePlan.status'), key: 'status' },
                  ]}
                />
              </div>
              {permissions.includes(Permissions.AddCarePlan) && (
                <Button
                  color="light"
                  icon="add"
                  iconLocation="left"
                  onClick={() => setShowAddCarePlanModal(true)}
                >
                  {t('patient.carePlan.new')}
                </Button>
              )}
            </div>
          </Row>
        </Container>
      </Panel>

      <NewAllergyModal
        show={showNewAllergyModal}
        onCloseButtonClick={() => setShowNewAllergyModal(false)}
        patientId={patient.id}
      />

      <AddDiagnosisModal
        show={showDiagnosisModal}
        onCloseButtonClick={() => setShowDiagnosisModal(false)}
      />

      <AddCarePlanModal
        show={showAddCarePlanModal}
        onCloseButtonClick={() => setShowAddCarePlanModal(false)}
        patient={patient}
      />

      <AddVisitModal
        show={showAddVisitModal}
        onCloseButtonClick={() => setShowAddVisitModal(false)}
      />
      <br />
    </div>
  )
}

export default ImportantPatientInfo
