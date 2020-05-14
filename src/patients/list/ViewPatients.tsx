import React, { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Spinner, Button, Container, Row, TextInput, Column } from '@hospitalrun/components'
import { useButtonToolbarSetter } from 'page-header/ButtonBarProvider'
import format from 'date-fns/format'
import SortRequest from 'clients/db/SortRequest'
import PageRequest from 'clients/db/PageRequest'
import PageComponent, { defaultPageSize } from 'components/PageComponent'
import useUpdateEffect from 'hooks/useUpdateEffect'
import { RootState } from '../../store'
import { searchPatients } from '../patients-slice'
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

  const defaultPageRequest = useRef<PageRequest>({
    size: defaultPageSize.value,
    number: 1,
    nextPageInfo: { index: null },
    previousPageInfo: { index: null },
    direction: 'next',
  })

  const [userPageRequest, setUserPageRequest] = useState<PageRequest>(defaultPageRequest.current)

  const setNextPageRequest = () => {
    setUserPageRequest(() => {
      const newPageRequest: PageRequest = {
        number:
          patients.pageRequest && patients.pageRequest.number ? patients.pageRequest.number + 1 : 1,
        size: patients.pageRequest ? patients.pageRequest.size : undefined,
        nextPageInfo: patients.pageRequest?.nextPageInfo,
        previousPageInfo: undefined,
        direction: 'next',
      }
      return newPageRequest
    })
  }

  const setPreviousPageRequest = () => {
    setUserPageRequest(() => ({
      number:
        patients.pageRequest && patients.pageRequest.number ? patients.pageRequest.number - 1 : 1,
      size: patients.pageRequest ? patients.pageRequest.size : undefined,
      nextPageInfo: undefined,
      previousPageInfo: patients.pageRequest?.previousPageInfo,
      direction: 'previous',
    }))
  }

  const [searchText, setSearchText] = useState<string>('')

  const debouncedSearchText = useDebounce(searchText, 500)
  const debouncedSearchTextRef = useRef<string>('')

  useUpdateEffect(() => {
    const sortRequest: SortRequest = {
      sorts: [{ field: 'index', direction: 'asc' }],
    }
    dispatch(searchPatients(debouncedSearchTextRef.current, sortRequest, userPageRequest))
  }, [dispatch, userPageRequest])

  useEffect(() => {
    const sortRequest: SortRequest = {
      sorts: [{ field: 'index', direction: 'asc' }],
    }

    debouncedSearchTextRef.current = debouncedSearchText
    dispatch(searchPatients(debouncedSearchText, sortRequest, defaultPageRequest.current))
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

  const onPageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = parseInt(event.target.value, 10)
    setUserPageRequest(() => ({
      size: newPageSize,
      number: 1,
      nextPageInfo: { index: null },
      previousPageInfo: { index: null },
      direction: 'next',
    }))
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
      <PageComponent
        hasNext={patients.hasNext}
        hasPrevious={patients.hasPrevious}
        pageNumber={patients.pageRequest ? patients.pageRequest.number : 1}
        setPreviousPageRequest={setPreviousPageRequest}
        setNextPageRequest={setNextPageRequest}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  )
}

export default ViewPatients
