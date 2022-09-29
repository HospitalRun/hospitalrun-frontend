import { Column, Container, Row } from '@hospitalrun/components'
import React, { useCallback, useState } from 'react'

import PatientSearchRequest from '../models/PatientSearchRequest'
import PatientSearchInput from './PatientSearchInput'
import ViewPatientsTable from './ViewPatientsTable'

const SearchPatients = () => {
  const [searchRequest, setSearchRequest] = useState<PatientSearchRequest>({ queryString: '' })

  const onSearchRequestChange = useCallback((newSearchRequest: PatientSearchRequest) => {
    setSearchRequest(newSearchRequest)
  }, [])

  return (
    <div>
      <Container
        style={{
          maxWidth: '100%',
          // width: '100vw',
          padding: 0,
          margin: 0,
        }}
      >
        <Row>
          <Column>
            <PatientSearchInput onChange={onSearchRequestChange} />
          </Column>
        </Row>
        <Row
          style={{
            width: '100%',
            display: 'flex',
            marginLeft: 0,
          }}
        >
          <ViewPatientsTable searchRequest={searchRequest} />
        </Row>
      </Container>
    </div>
  )
}

export default SearchPatients
