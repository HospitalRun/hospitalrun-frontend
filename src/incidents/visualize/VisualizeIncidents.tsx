import { LineGraph } from '@hospitalrun/components'
import React, { useEffect, useState } from 'react'

import useIncidents from '../hooks/useIncidents'
import IncidentFilter from '../IncidentFilter'
import IncidentSearchRequest from '../model/IncidentSearchRequest'

const VisualizeIncidents = () => {
  const searchFilter = IncidentFilter.reported
  const searchRequest: IncidentSearchRequest = { status: searchFilter }
  const { data, isLoading } = useIncidents(searchRequest)
  const [incident, setIncident] = useState(0)
  const [monthlyIncidents, setMonthlyIncidents] = useState([
    // monthlyIncidents[0] -> January ... monthlyIncidents[11] -> December
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
  ])

  const getIncidentMonth = (reportedOn: string) =>
    // reportedOn: "2020-08-12T19:53:30.153Z"
    Number(reportedOn.slice(5, 7)) - 1

  useEffect(() => {
    if (data === undefined || isLoading) {
      // const spinner = <Spinner type="DotLoader" loading />
    } else {
      const totalIncidents: number = data.length
      if (totalIncidents > incident) {
        const incidentMonth = getIncidentMonth(data[incident].reportedOn)
        setMonthlyIncidents((prevIncidents) =>
          prevIncidents.map((value, index) => (index === incidentMonth ? value + 1 : value)),
        )
        setIncident(incident + 1)
      }
    }
  }, [data, monthlyIncidents])

  return (
    <>
      <LineGraph
        datasets={[
          {
            backgroundColor: 'blue',
            borderColor: 'black',
            data: [
              {
                x: 'January',
                y: 12,
              },
              {
                x: 'February',
                y: 11,
              },
              {
                x: 'March',
                y: 10,
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
