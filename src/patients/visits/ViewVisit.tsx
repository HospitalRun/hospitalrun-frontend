import { Button } from '@hospitalrun/components'
import React from 'react'
import { useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'

import Loading from '../../shared/components/Loading'
import useTranslator from '../../shared/hooks/useTranslator'
import Permissions from '../../shared/model/Permissions'
import { RootState } from '../../shared/store'
import useVisit from '../hooks/useVisit'
import VisitForm from './VisitForm'

interface Props {
  patientId: string
}
const ViewVisit = ({ patientId }: Props) => {
  const { visitId } = useParams()
  const history = useHistory()
  const { permissions } = useSelector((state: RootState) => state.user)
  const { t } = useTranslator()

  const { data: visit, status } = useVisit(patientId, visitId)

  if (visit === undefined || status === 'loading') {
    return <Loading />
  }

  return (
    <>
      <div className="col d-flex justify-content-between">
        <h2>{visit.reason}</h2>
        {permissions.includes(Permissions.RequestImaging) && (
          <Button
            outlined
            color="success"
            icon="add"
            iconLocation="left"
            onClick={() => history.push('/imaging/new', { patientId, visitId })}
          >
            {t('patient.visits.newImaging')}
          </Button>
        )}
      </div>
      <VisitForm visit={visit} disabled />
    </>
  )
}

export default ViewVisit
