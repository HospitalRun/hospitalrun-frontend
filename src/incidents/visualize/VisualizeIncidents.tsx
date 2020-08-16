import { Spinner, LineGraph } from '@hospitalrun/components'
import React from 'react'

import useIncidents from '../hooks/useIncidents'
import IncidentFilter from '../IncidentFilter'
import IncidentSearchRequest from '../model/IncidentSearchRequest'

const VisualizeIncidents = () => {
  const searchFilter = IncidentFilter.reported
  const searchRequest: IncidentSearchRequest = { status: searchFilter }
  const { data, isLoading } = useIncidents(searchRequest)

  if (data === undefined || isLoading) {
    return <Spinner type="DotLoader" loading />
  }

  // reportedOn: "2020-08-12T19:53:30.153Z"
  // we can use a function that splices the string at position 6-7 to get the month

  console.log('data: ', data)
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
