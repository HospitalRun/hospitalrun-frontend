import { Spinner, Button, Container, Row, TextInput, Column } from '@hospitalrun/components'
import format from 'date-fns/format'
import React, { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import useAddBreadcrumbs from '../../breadcrumbs/useAddBreadcrumbs'
import SortRequest from '../../clients/db/SortRequest'
import useDebounce from '../../hooks/debounce'
import useUpdateEffect from '../../hooks/useUpdateEffect'
import { useButtonToolbarSetter } from '../../page-header/ButtonBarProvider'
import useTitle from '../../page-header/useTitle'
import { RootState } from '../../store'
import { searchPatients } from '../patients-slice'

const breadcrumbs = [{ i18nKey: 'patients.label', location: '/patients' }]

const ViewPatients = () => {
  const { t } = useTranslation()
  const history = useHistory()
  useTitle(t('patients.label'))
  useAddBreadcrumbs(breadcrumbs, true)
  const dispatch = useDispatch()
  const { patients, isLoading } = useSelector((state: RootState) => state.patients)

  const setButtonToolBar = useButtonToolbarSetter()

  const [searchText, setSearchText] = useState<string>('')

  const debouncedSearchText = useDebounce(searchText, 500)
  const debouncedSearchTextRef = useRef<string>('')

  useUpdateEffect(() => {
    const sortRequest: SortRequest = {
      sorts: [{ field: 'index', direction: 'asc' }],
    }
    dispatch(searchPatients(debouncedSearchTextRef.current, sortRequest))
  }, [dispatch])

  useEffect(() => {
    const sortRequest: SortRequest = {
      sorts: [{ field: 'index', direction: 'asc' }],
    }

    debouncedSearchTextRef.current = debouncedSearchText
    dispatch(searchPatients(debouncedSearchText, sortRequest))
  }, [dispatch, debouncedSearchText])

  useEffect(() => {
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

    return () => {
      setButtonToolBar([])
    }
  }, [dispatch, setButtonToolBar, t, history])

  const loadingIndicator = <Spinner color="blue" loading size={[10, 25]} type="ScaleLoader" />
  const table = (
    <table className="table table-hover">
      <thead className="thead-light ">
        <tr>
          <th>{t('patient.code')}</th>
          <th>{t('patient.givenName')}</th>
          <th>{t('patient.familyName')}</th>
          <th>{t('patient.sex')}</th>
          <th>{t('patient.dateOfBirth')}</th>
        </tr>
      </thead>
      <tbody>
        {patients.map((p) => (
          <tr key={p.id} onClick={() => history.push(`/patients/${p.id}`)}>
            <td>{p.code}</td>
            <td>{p.givenName}</td>
            <td>{p.familyName}</td>
            <td>{p.sex}</td>
            <td>{p.dateOfBirth ? format(new Date(p.dateOfBirth), 'yyyy-MM-dd') : ''}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )

  const onSearchBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value)
  }

  return (
    <div>
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
        <Row> {isLoading ? loadingIndicator : table}</Row>
      </Container>
    </div>
  )
}

export default ViewPatients
