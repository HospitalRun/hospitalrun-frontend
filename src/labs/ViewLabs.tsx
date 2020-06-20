import { Spinner, Button } from '@hospitalrun/components'
import format from 'date-fns/format'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import PageRequest from '../clients/db/PageRequest'
import SelectWithLabelFormGroup from '../components/input/SelectWithLableFormGroup'
import TextInputWithLabelFormGroup from '../components/input/TextInputWithLabelFormGroup'
import PageComponent, { defaultPageSize } from '../components/PageComponent'
import useDebounce from '../hooks/debounce'
import useUpdateEffect from '../hooks/useUpdateEffect'
import Lab from '../model/Lab'
import Permissions from '../model/Permissions'
import { useButtonToolbarSetter } from '../page-header/ButtonBarProvider'
import useTitle from '../page-header/useTitle'
import { RootState } from '../store'
import { searchLabs } from './labs-slice'

type filter = 'requested' | 'completed' | 'canceled' | 'all'

const ViewLabs = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const setButtons = useButtonToolbarSetter()
  useTitle(t('labs.label'))

  const { permissions } = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch()
  const { labs, isLoading } = useSelector((state: RootState) => state.labs)
  const [searchFilter, setSearchFilter] = useState<filter>('all')
  const [searchText, setSearchText] = useState<string>('')
  const debouncedSearchText = useDebounce(searchText, 500)
  const debouncedSearchTextRef = useRef<string>('')

  const defaultPageRequest = useRef<PageRequest>({
    size: defaultPageSize.value,
    number: 1,
    nextPageInfo: { index: null },
    previousPageInfo: { index: null },
    direction: 'next',
  })
  const [userPageRequest, setUserPageRequest] = useState<PageRequest>(defaultPageRequest.current)

  const getButtons = useCallback(() => {
    const buttons: React.ReactNode[] = []

    if (permissions.includes(Permissions.RequestLab)) {
      buttons.push(
        <Button
          icon="add"
          onClick={() => history.push('/labs/new')}
          outlined
          color="success"
          key="lab.requests.new"
        >
          {t('labs.requests.new')}
        </Button>,
      )
    }

    return buttons
  }, [permissions, history, t])

  const setFilter = (filter: string) =>
    filter === 'requested'
      ? 'requested'
      : filter === 'completed'
      ? 'completed'
      : filter === 'canceled'
      ? 'canceled'
      : 'all'

  useEffect(() => {
    debouncedSearchTextRef.current = debouncedSearchText
    dispatch(searchLabs(debouncedSearchText, searchFilter, defaultPageRequest.current))
  }, [dispatch, debouncedSearchText, searchFilter])

  useUpdateEffect(() => {
    dispatch(searchLabs(debouncedSearchTextRef.current, searchFilter, userPageRequest))
  }, [dispatch, userPageRequest])

  useEffect(() => {
    setButtons(getButtons())
    return () => {
      setButtons([])
    }
  }, [dispatch, getButtons, setButtons])

  const loadingIndicator = <Spinner color="blue" loading size={[10, 25]} type="ScaleLoader" />

  const onTableRowClick = (lab: Lab) => {
    history.push(`/labs/${lab.id}`)
  }

  const onSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchFilter(setFilter(event.target.value))
  }

  const onSearchBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value)
  }

  const setNextPageRequest = () => {
    setUserPageRequest(() => {
      const newPageRequest: PageRequest = {
        number: labs.pageRequest && labs.pageRequest.number ? labs.pageRequest.number + 1 : 1,
        size: labs.pageRequest ? labs.pageRequest.size : undefined,
        nextPageInfo: labs.pageRequest?.nextPageInfo,
        previousPageInfo: undefined,
        direction: 'next',
      }
      return newPageRequest
    })
  }

  const setPreviousPageRequest = () => {
    setUserPageRequest(() => ({
      number: labs.pageRequest && labs.pageRequest.number ? labs.pageRequest.number - 1 : 1,
      size: labs.pageRequest ? labs.pageRequest.size : undefined,
      nextPageInfo: undefined,
      previousPageInfo: labs.pageRequest?.previousPageInfo,
      direction: 'previous',
    }))
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

  const listBody = (
    <tbody>
      {labs.content.map((lab) => (
        <tr onClick={() => onTableRowClick(lab)} key={lab.id}>
          <td>{lab.code}</td>
          <td>{lab.type}</td>
          <td>{format(new Date(lab.requestedOn), 'yyyy-MM-dd hh:mm a')}</td>
          <td>{lab.status}</td>
        </tr>
      ))}
    </tbody>
  )

  return (
    <>
      <div className="row">
        <div className="col-md-3 col-lg-2">
          <SelectWithLabelFormGroup
            name="type"
            value={searchFilter}
            label={t('labs.filterTitle')}
            isEditable
            options={[
              { label: t('labs.status.requested'), value: 'requested' },
              { label: t('labs.status.completed'), value: 'completed' },
              { label: t('labs.status.canceled'), value: 'canceled' },
              { label: t('labs.filter.all'), value: 'all' },
            ]}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
              onSelectChange(event)
            }}
          />
        </div>
        <div className="col">
          <TextInputWithLabelFormGroup
            name="searchbox"
            label="Search Labs"
            placeholder="Search labs by type"
            value={searchText}
            isEditable
            onChange={onSearchBoxChange}
          />
        </div>
      </div>
      <div className="row">
        <table className="table table-hover">
          <thead className="thead-light">
            <tr>
              <th>{t('labs.lab.code')}</th>
              <th>{t('labs.lab.type')}</th>
              <th>{t('labs.lab.requestedOn')}</th>
              <th>{t('labs.lab.status')}</th>
            </tr>
          </thead>
          {isLoading ? loadingIndicator : listBody}
        </table>
      </div>
      <PageComponent
        hasNext={labs.hasNext}
        hasPrevious={labs.hasPrevious}
        pageNumber={labs.pageRequest ? labs.pageRequest.number : 1}
        setPreviousPageRequest={setPreviousPageRequest}
        setNextPageRequest={setNextPageRequest}
        onPageSizeChange={onPageSizeChange}
      />
    </>
  )
}

export default ViewLabs
