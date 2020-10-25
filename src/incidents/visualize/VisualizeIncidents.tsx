import { LineGraph, Spinner } from '@hospitalrun/components'
import React, { useEffect, useState } from 'react'

import { useUpdateTitle } from '../../page-header/title/TitleContext'
import useTranslator from '../../shared/hooks/useTranslator'
import useIncidents from '../hooks/useIncidents'
import IncidentFilter from '../IncidentFilter'
import IncidentSearchRequest from '../model/IncidentSearchRequest'

const VisualizeIncidents = () => {
  const { t } = useTranslator()
  const updateTitle = useUpdateTitle()
  useEffect(() => {
    updateTitle(t('incidents.visualize.view'))
  })
  const searchFilter = IncidentFilter.reported
  const searchRequest: IncidentSearchRequest = { status: searchFilter }
  const { data, isLoading } = useIncidents(searchRequest)
  const [incident, setIncident] = useState(0)
  const [showGraph, setShowGraph] = useState(false)
  const [monthlyIncidents, setMonthlyIncidents] = useState(Array(12).fill(0))

  const getIncidentMonth = (reportedOn: string) =>
    // reportedOn: "2020-08-12T19:53:30.153Z"
    Number(reportedOn.slice(5, 7)) - 1

  useEffect(() => {
    if (data === undefined || isLoading) {
      // incidents data not loaded yet, do nothing
    } else {
      const totalIncidents: number = data.length
      if (totalIncidents > incident) {
        const incidentMonth = getIncidentMonth(data[incident].reportedOn)
        setMonthlyIncidents((prevIncidents) =>
          prevIncidents.map((value, index) => (index === incidentMonth ? value + 1 : value)),
        )
        setIncident(incident + 1)
      } else if (totalIncidents === incident) {
        // incidents data finished processing
        setShowGraph(true)
      }
    }
  }, [data, monthlyIncidents, isLoading, incident])

  return !showGraph ? (
    <Spinner type="DotLoader" loading />
  ) : (
    <>
      <LineGraph
        datasets={[
          {
            backgroundColor: 'blue',
            borderColor: 'black',
            data: [
              {
                x: 'January',
                y: monthlyIncidents[0],
              },
              {
                x: 'February',
                y: monthlyIncidents[1],
              },
              {
                x: 'March',
                y: monthlyIncidents[2],
              },
              {
                x: 'April',
                y: monthlyIncidents[3],
              },
              {
                x: 'May',
                y: monthlyIncidents[4],
              },
              {
                x: 'June',
                y: monthlyIncidents[5],
              },
              {
                x: 'July',
                y: monthlyIncidents[6],
              },
              {
                x: 'August',
                y: monthlyIncidents[7],
              },
              {
                x: 'September',
                y: monthlyIncidents[8],
              },
              {
                x: 'October',
                y: monthlyIncidents[9],
              },
              {
                x: 'November',
                y: monthlyIncidents[10],
              },
              {
                x: 'December',
                y: monthlyIncidents[11],
              },
            ],
            label: 'Incidents',
          },
        ]}
        title="Reported Incidents Overtime"
        xAxes={[
          {
            label: 'Months',
            type: 'category',
          },
        ]}
        yAxes={[
          {
            label: 'Numbers',
            type: 'linear',
          },
        ]}
      />
    </>
  )
}

export default VisualizeIncidents
