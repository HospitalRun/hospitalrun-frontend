import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Spinner, Button, Container, Row, TextInput, Column } from '@hospitalrun/components'
import { useButtonToolbarSetter } from 'page-header/ButtonBarProvider'
import format from 'date-fns/format'
import SortRequest from 'clients/db/SortRequest'
import PageRequest from 'clients/db/PageRequest'
import PageComponent from 'components/PageComponent'
import { RootState } from '../../store'
import { fetchPatients, searchPatients } from '../patients-slice'
import useTitle from '../../page-header/useTitle'
import useAddBreadcrumbs from '../../breadcrumbs/useAddBreadcrumbs'
import useDebounce from '../../hooks/debounce'

const breadcrumbs = [{ i18nKey: 'patients.label', location: '/patients' }]

const ViewPatients = () => {
  const { t } = useTranslation()
  const history = useHistory()
  useTitle(t('patients.label'))
  useAddBreadcrumbs(breadcrumbs, true)
  const dispatch = useDispatch()
  const { patients, isLoading } = useSelector((state: RootState) => state.patients)

  const setButtonToolBar = useButtonToolbarSetter()
  const [userPageRequest, setUserPageRequest] = useState<PageRequest>({
    size: 1,
    number: 1,
    nextPageInfo: { index: null },
    direction: 'next',
  })

  const setNextPageRequest = () => {
    setUserPageRequest((p) => {
      if (p && p.number && p.number >= 0 && p.size) {
        const newPageRequest: PageRequest = {
          number: p.number + 1,
          size: p.size,
          nextPageInfo: patients.pageRequest?.nextPageInfo,
          direction: 'next',
        }
        return newPageRequest
      }
      return p
    })
  }

  const setPreviousPageRequest = () => {
    setUserPageRequest((p) => {
      if (p.number && p.size) {
        return {
          number: p.number - 1,
          size: p.size,
          nextPageInfo: patients.pageRequest?.nextPageInfo,
          direction: 'previous',
        }
      }
      return p
    })
  }
  const [searchText, setSearchText] = useState<string>('')

  const debouncedSearchText = useDebounce(searchText, 500)

  useEffect(() => {
    const sortRequest: SortRequest = {
      sorts: [{ field: 'index', direction: 'asc' }],
    }
    dispatch(searchPatients(debouncedSearchText, sortRequest, userPageRequest))
  }, [dispatch, debouncedSearchText, userPageRequest])

  useEffect(() => {
    const sortRequest: SortRequest = {
      sorts: [{ field: 'index', direction: 'asc' }],
    }
    dispatch(fetchPatients(sortRequest, userPageRequest))

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
  }, [dispatch, setButtonToolBar, t, history, userPageRequest])

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
        {patients.content.map((p) => (
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
      <PageComponent
        hasNext={patients.hasNext}
        hasPrevious={patients.hasPrevious}
        pageNumber={userPageRequest.number}
        setPreviousPageRequest={setPreviousPageRequest}
        setNextPageRequest={setNextPageRequest}
      />
    </Container>
  )
}

export default ViewPatients
