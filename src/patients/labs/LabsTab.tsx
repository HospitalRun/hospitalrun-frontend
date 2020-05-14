import { Alert } from '@hospitalrun/components'
import format from 'date-fns/format'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'

import LabRepository from '../../clients/db/LabRepository'
import Lab from '../../model/Lab'

interface Props {
  patientId: string
}

const LabsTab = (props: Props) => {
  const history = useHistory()
  const { patientId } = props
  const { t } = useTranslation()

  const [labs, setLabs] = useState<Lab[]>([])

  useEffect(() => {
    const fetch = async () => {
      const fetchedLabs = await LabRepository.findAllByPatientId(patientId)
      setLabs(fetchedLabs)
    }

    fetch()
  }, [patientId])

  const onTableRowClick = (lab: Lab) => {
    history.push(`/labs/${lab.id}`)
  }

  return (
    <div>
      {(!labs || labs.length === 0) && (
        <Alert
          color="warning"
          title={t('patient.labs.warning.noLabs')}
          message={t('patient.labs.noLabsMessage')}
        />
      )}
      {labs && labs.length > 0 && (
        <table className="table table-hover">
          <thead className="thead-light">
            <tr>
              <th>{t('labs.lab.type')}</th>
              <th>{t('labs.lab.requestedOn')}</th>
              <th>{t('labs.lab.status')}</th>
            </tr>
          </thead>
          <tbody>
            {labs.map((lab) => (
              <tr onClick={() => onTableRowClick(lab)} key={lab.id}>
                <td>{lab.type}</td>
                <td>{format(new Date(lab.requestedOn), 'yyyy-MM-dd hh:mm a')}</td>
                <td>{lab.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default LabsTab
