import { LineGraph } from '@hospitalrun/components'
import React, { useEffect, useState } from 'react'

import useIncidents from '../hooks/useIncidents'
import IncidentFilter from '../IncidentFilter'
import IncidentSearchRequest from '../model/IncidentSearchRequest'

const VisualizeIncidents = () => {
  const searchFilter = IncidentFilter.reported
  const searchRequest: IncidentSearchRequest = { status: searchFilter }
  const { data, isLoading } = useIncidents(searchRequest)
  const [monthlyIncidents, setMonthlyIncidents] = useState({
    January: 0,
    February: 0,
    March: 0,
    April: 0,
    May: 0,
    June: 0,
    July: 0,
    August: 0,
    September: 0,
    November: 0,
    December: 0,
  })

  const getIncidentMonth = (reportedOn: string) => {
    // reportedOn: "2020-08-12T19:53:30.153Z"
    // splices the data.reportedOn string at position 5-6 to get the month
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'November',
      'December',
    ]
    return months[Number(reportedOn.slice(5, 7)) - 1]
  }

  useEffect(() => {
    if (data === undefined || isLoading) {
      console.log('data is undefined')
    } else {
      let incidentMonth: string
      const totalIncidents: number = data.length
      for (let incident = 0; incident < totalIncidents; incident += 1) {
        incidentMonth = getIncidentMonth(data[incident].reportedOn)
        setMonthlyIncidents((state) => ({
          ...state,
          // incidentMonth: incidentMonth + 1,
        }))
        console.log('incidentMonth: ', incidentMonth)
      }
    }
  }, [])

  //   if (data === undefined || isLoading) {
  //     return <Spinner type="DotLoader" loading />
  //   }

  console.log('August: ', monthlyIncidents.August)

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
