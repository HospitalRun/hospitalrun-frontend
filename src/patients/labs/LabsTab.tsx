import { Alert, Table } from '@hospitalrun/components'
import format from 'date-fns/format'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

import PatientRepository from '../../shared/db/PatientRepository'
import useTranslator from '../../shared/hooks/useTranslator'
import Lab from '../../shared/model/Lab'

interface Props {
  patientId: string
}

const LabsTab = (props: Props) => {
  const history = useHistory()
  const { patientId } = props
  const { t } = useTranslator()

  const [labs, setLabs] = useState<Lab[]>([])

  useEffect(() => {
    const fetch = async () => {
      const fetchedLabs = await PatientRepository.getLabs(patientId)
      setLabs(fetchedLabs)
    }

    fetch()
  }, [patientId])

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
        <Table
          actionsHeaderText={t('actions.label')}
          getID={(row) => row.id}
          data={labs}
          columns={[
            { label: t('labs.lab.type'), key: 'type' },
            {
              label: t('labs.lab.requestedOn'),
              key: 'requestedOn',
              formatter: (row) => format(new Date(row.requestedOn), 'yyyy-MM-dd hh:mm a'),
            },
            { label: t('labs.lab.status'), key: 'status' },
          ]}
          actions={[{ label: t('actions.view'), action: (row) => history.push(`/labs/${row.id}`) }]}
        />
      )}
    </div>
  )
}

export default LabsTab
