import { Column, Container, Row } from '@hospitalrun/components'
import React, { useCallback, useEffect, useState } from 'react'
import { Button } from '@hospitalrun/components'
import PatientSearchRequest from '../models/PatientSearchRequest'
import PatientSearchInput from './PatientSearchInput'
import ViewPatientsTable from './ViewPatientsTable'
import FilterMenu from './filter/PatientFilter'
import { data } from './../util/constants'
import PatientRepository from '../../shared/db/PatientRepository'
import Patient from '../../shared/model/Patient'

export interface ILabelsContext {
  filterLabels: string[]
  setFilterLabels: React.Dispatch<React.SetStateAction<string[]>>
}
export const LabelsContext = React.createContext<ILabelsContext>({
  filterLabels: [],
  setFilterLabels: () => {},
})

const SearchPatients = () => {
  const [searchRequest, setSearchRequest] = useState<PatientSearchRequest>({ queryString: '' })
  const [filterMenuState, setFilterMenuState] = useState(false)
  const [filterLabels, setFilterLabels] = useState<string[]>([])
  const filterLabelsValue = { filterLabels, setFilterLabels }
  const [filteredPatientData, setFilteredPatientData] = useState<Patient[]>([])
  const [filterValues, setFilterValues] = useState<Array<String>>([])
  const [clearFilterS, setClearFilterS]= useState(false)
  const [trigger, setTrigger]= useState<boolean>(false)
 

  

  const onSearchRequestChange = useCallback((newSearchRequest: PatientSearchRequest) => {
    setSearchRequest(newSearchRequest)
  }, [])

  const openFilterMenu = () => {
    setFilterMenuState(true)
  }

  const handleClose = () => {
    setFilterMenuState(!filterMenuState)
  }
  const clearFilter = () => {
    setFilteredPatientData([])
    setClearFilterS(false)
    setTrigger(true)
  }
const changeTrigger = (param:boolean) =>{
  setTrigger(param)
}



 
  let allFilterData: any = []
  useEffect(() => {
   
  }, [allFilterData]);

  function getAge(dateString:string) {   
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    return age;
}

  const filterAllPatientData1 = async (param:any) => {
    console.log('paramValues: ',param,param.length)
    if (param?.length > 0) {
     
      let tempData = await PatientRepository.findAll()
      param.map((data:String)=>{
        tempData.map((data2)=>{
          if(data === data2.sex){
            allFilterData.push(data2)
            console.log('newdata: ', allFilterData)
          }
          else{
            let age=getAge(data2.dateOfBirth)
            if(data === '0 - 20 yrs' && age<=20 && !allFilterData.includes(data2)){
              allFilterData.push(data2)
            }
            if(data === '21 - 40 yrs' && age>20 && age<=40 && !allFilterData.includes(data2)){
              allFilterData.push(data2)
            }
            if(data === '41 - 60 yrs' && age>40 && age<=60 && !allFilterData.includes(data2)){
              allFilterData.push(data2)
            }
            if(data === '61 + yrs' && age>60 && !allFilterData.includes(data2)){
              allFilterData.push(data2)
            }
          }
         
        })
      })
      console.log('allFilterData: ',allFilterData)        
      setFilteredPatientData(allFilterData)
      console.log('filteredPatientData',filteredPatientData)
    }
  }

  return (
    <LabelsContext.Provider value={filterLabelsValue}>
      <div>
        <Container>
          <FilterMenu
            filterMenuState={filterMenuState}
            handleClose={handleClose}
            data={data}
            handleFilters={(param) => {
              console.log('param: ', param)
              setFilterValues(param)
              console.log('insidefilterValues: ', filterValues)
              filterAllPatientData1(param)
              setClearFilterS(true)
            }}
            handleApply={() => {}}
            clearFilters={changeTrigger}
            trigger={trigger}
            
          />
          <Row>
            <Column md={12}>
              <Row>
                <Column md={8} style={{ paddingLeft: '0px' }}>
                  <PatientSearchInput data-testid={'searcinput'} onChange={onSearchRequestChange} />
                </Column>
                <Column md={2} style={{ display: 'flex', justifyContent: 'end', padding: '0px' }}>
                  <Button
                    style={{ width: '7vw', height: '2.97rem' }}
                    key="filterButton"
                    outlined
                    color="success"
                    onClick={openFilterMenu}
                  >
                    Filter
                  </Button>
                </Column>
                <Column md={2} style={{ display: 'flex', justifyContent: 'end', padding: '0px' }}>
                  <Button
                    style={{ width: '7vw', height: '2.97rem' }}
                    key="filterButton"
                    outlined
                    color="success"
                    onClick={clearFilter}
                  >
                    Clear Filter
                  </Button>
                </Column>
              </Row>
            </Column>
          </Row>
          <Row>
            <ViewPatientsTable searchRequest={searchRequest} filtered={clearFilterS} patientData={clearFilterS ? filteredPatientData : []} />
          </Row>
        </Container>
      </div>
    </LabelsContext.Provider>
  )
}

export default SearchPatients
