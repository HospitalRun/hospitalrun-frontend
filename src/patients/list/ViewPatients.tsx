import {
  Spinner,
  Button,
  Container,
  Row,
  TextInput,
  Column,
  Table,
  Icon,
  Typography,
} from '@hospitalrun/components'
import format from 'date-fns/format'
import React, { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import useAddBreadcrumbs from '../../page-header/breadcrumbs/useAddBreadcrumbs'
import { useButtonToolbarSetter } from '../../page-header/button-toolbar/ButtonBarProvider'
import useTitle from '../../page-header/title/useTitle'
import SortRequest from '../../shared/db/SortRequest'
import useDebounce from '../../shared/hooks/useDebounce'
import useTranslator from '../../shared/hooks/useTranslator'
import useUpdateEffect from '../../shared/hooks/useUpdateEffect'
import { RootState } from '../../shared/store'
import { searchPatients } from '../patients-slice'

const breadcrumbs = [{ i18nKey: 'patients.label', location: '/patients' }]

const ViewPatients = () => {
  const { t } = useTranslator()
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
    if (patients && patients.length > 0) {
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
    }
    return () => {
      setButtonToolBar([])
    }
  }, [dispatch, setButtonToolBar, t, history])

  const loadingIndicator = <Spinner color="blue" loading size={[10, 25]} type="ScaleLoader" />
  const table = (
    <Table
      data={patients}
      getID={(row) => row.id}
      columns={[
        { label: t('patient.code'), key: 'code' },
        { label: t('patient.givenName'), key: 'givenName' },
        { label: t('patient.familyName'), key: 'familyName' },
        { label: t('patient.sex'), key: 'sex' },
        {
          label: t('patient.dateOfBirth'),
          key: 'dateOfBirth',
          formatter: (row) =>
            row.dateOfBirth ? format(new Date(row.dateOfBirth), 'yyyy-MM-dd') : '',
        },
      ]}
      actionsHeaderText={t('actions.label')}
      actions={[{ label: t('actions.view'), action: (row) => history.push(`/patients/${row.id}`) }]}
    />
  )

  const onSearchBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value)
  }

  if (patients && patients.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Icon icon="patient" outline={false} size="6x" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', width: '60%', margin: 16 }}>
              <Typography variant="h5">{t('patients.noPatients')}</Typography>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              key="newPatientButton"
              outlined
              color="success"
              icon="patient-add"
              onClick={() => history.push('/patients/new')}
            >
              {t('patients.newPatient')}
            </Button>
          </div>
        </div>
      </div>
    )
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
