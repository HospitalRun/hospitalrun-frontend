import React from 'react'

import HistoryTable from './HistoryTable'

interface Props {
  patientId: string
}

const HistoryTab = ({ patientId }: Props) => (
  <>
    <HistoryTable patientId={patientId} />
  </>
)

export default HistoryTab
