import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router'
import { useTranslation } from 'react-i18next'
import {
  Spinner,
  Button,
  List,
  ListItem,
  Container,
  Row,
  TextInput,
  Column,
} from '@hospitalrun/components'
import { useButtonToolbarSetter } from 'page-header/ButtonBarProvider'
import { RootState } from '../../store'
import { fetchPatients, searchPatients } from '../patients-slice'
import useTitle from '../../page-header/useTitle'
import useAddBreadcrumbs from '../../breadcrumbs/useAddBreadcrumbs'

const breadcrumbs = [{ i18nKey: 'patients.label', location: '/patients' }]

function useDebounce(value: any, delayInMilliseconds: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const debounceHandler = setTimeout(() => setDebouncedValue(value), delayInMilliseconds)

    return () => clearTimeout(debounceHandler)
  }, [value])

  return debouncedValue
}

const Patients = () => {
  const { t } = useTranslation()
  const history = useHistory()
  useTitle(t('patients.label'))
  useAddBreadcrumbs(breadcrumbs, true)
  const dispatch = useDispatch()
  const { patients, isLoading } = useSelector((state: RootState) => state.patients)

  const setButtonToolBar = useButtonToolbarSetter()
  setButtonToolBar([
    <Button
      key="newPatientButton"
      outlined
      color="success"
      icon="patient-add"
      onClick={() => history.push('/patients/new')}
    >
      {t('patients.newPatient')}
    </Button>,
  ])

  const [searchText, setSearchText] = useState<string>('')

  const debouncedSearchText = useDebounce(searchText, 500)

  useEffect(() => {
    dispatch(searchPatients(debouncedSearchText))
  }, [dispatch, debouncedSearchText])

  useEffect(() => {
    dispatch(fetchPatients())

    return () => {
      setButtonToolBar([])
    }
  }, [dispatch, setButtonToolBar])

  const loadingIndicator = <Spinner color="blue" loading size={[10, 25]} type="ScaleLoader" />

  const list = (
    <ul>
      {patients.map((p) => (
        <ListItem action key={p.id} onClick={() => history.push(`/patients/${p.id}`)}>
          {p.fullName} ({p.code})
        </ListItem>
      ))}
    </ul>
  )

  const onSearchBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value)
  }

  return (
    <Container>
      <Row>
        <Column md={12}>
          <TextInput
            size="lg"
            type="text"
            onChange={onSearchBoxChange}
            value={searchText}
            placeholder={t('actions.search')}
          />
        </Column>
      </Row>

      <Row>
        <List layout="flush" style={{ width: '100%', marginTop: '10px', marginLeft: '-25px' }}>
          {isLoading ? loadingIndicator : list}
        </List>
      </Row>
    </Container>
  )
}

export default Patients
