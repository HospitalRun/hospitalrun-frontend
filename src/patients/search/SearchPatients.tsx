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
      <Container>
        <Row>
          <Column md={12}>
            <PatientSearchInput onChange={onSearchRequestChange} />
          </Column>
        </Row>
        <Row>
          <ViewPatientsTable searchRequest={searchRequest} />
        </Row>
      </Container>
    </div>
  )
}

export default SearchPatients
