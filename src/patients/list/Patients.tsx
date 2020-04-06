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

  useEffect(() => {
    dispatch(fetchPatients())

    return () => {
      setButtonToolBar([])
    }
  }, [dispatch, setButtonToolBar])

  if (isLoading) {
    return <Spinner color="blue" loading size={[10, 25]} type="ScaleLoader" />
  }

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

  const onSearchFormSubmit = (event: React.FormEvent | React.MouseEvent) => {
    event.preventDefault()
    dispatch(searchPatients(searchText))
  }

  return (
    <Container>
      <form className="form" onSubmit={onSearchFormSubmit}>
        <Row>
          <Column md={10}>
            <TextInput
              size="lg"
              type="text"
              onChange={onSearchBoxChange}
              value={searchText}
              placeholder={t('actions.search')}
            />
          </Column>
          <Column md={2}>
            <Button size="large" onClick={onSearchFormSubmit}>
              {t('actions.search')}
            </Button>
          </Column>
        </Row>
      </form>

      <Row>
        <List layout="flush" style={{ width: '100%', marginTop: '10px', marginLeft: '-25px' }}>
          {list}
        </List>
      </Row>
    </Container>
  )
}

export default Patients
