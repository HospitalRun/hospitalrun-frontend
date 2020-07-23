import { Button, Table } from '@hospitalrun/components'
import format from 'date-fns/format'
import React, { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { useButtonToolbarSetter } from '../page-header/button-toolbar/ButtonBarProvider'
import useTitle from '../page-header/title/useTitle'
// import SelectWithLabelFormGroup, {
//   Option,
// } from '../shared/components/input/SelectWithLableFormGroup'
import useDebounce from '../shared/hooks/useDebounce'
import useTranslator from '../shared/hooks/useTranslator'
import Permissions from '../shared/model/Permissions'
import { RootState } from '../shared/store'
import { extractUsername } from '../shared/util/extractUsername'
import { searchImagings } from './imagings-slice'

type ImagingFilter = 'requested' | 'completed' | 'canceled' | 'all'

const ViewImagings = () => {
  const { t } = useTranslator()
  const history = useHistory()
  const setButtons = useButtonToolbarSetter()
  useTitle(t('imagings.label'))

  const { permissions } = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch()
  const { imagings } = useSelector((state: RootState) => state.imagings)
  const [searchFilter, setSearchFilter] = useState<ImagingFilter>('all')

  const debouncedSearchText = useDebounce(' ', 500)

  const getButtons = useCallback(() => {
    const buttons: React.ReactNode[] = []

    if (permissions.includes(Permissions.RequestImaging)) {
      buttons.push(
        <Button
          icon="add"
          onClick={() => history.push('/imagings/new')}
          outlined
          color="success"
          key="imaging.requests.new"
        >
          {t('imagings.requests.new')}
        </Button>,
      )
    }

    return buttons
  }, [permissions, history, t])

  useEffect(() => {
    setSearchFilter('all' as ImagingFilter)
  }, [])

  useEffect(() => {
    dispatch(searchImagings(debouncedSearchText, searchFilter))
  }, [dispatch, debouncedSearchText, searchFilter])

  useEffect(() => {
    setButtons(getButtons())
    return () => {
      setButtons([])
    }
  }, [dispatch, getButtons, setButtons])

  // const filterOptions: Option[] = [
  //   { label: t('imagings.status.requested'), value: 'requested' },
  //   { label: t('imagings.status.completed'), value: 'completed' },
  //   { label: t('imagings.status.canceled'), value: 'canceled' },
  //   { label: t('imagings.filter.all'), value: 'all' },
  // ]
  return (
    <>
      {/* <div className="row"> 
        <div className="col-md-3 col-lg-2">
          <SelectWithLabelFormGroup
            name="type"
            label={t('imagings.filterTitle')}
            options={filterOptions}
            defaultSelected={filterOptions.filter(({ value }) => value === searchFilter)}
            onChange={(values) => setSearchFilter(values[0] as ImagingFilter)}
            isEditable
          />
        </div>
      </div>   */}

      <div className="row">
        <Table
          getID={(row) => row.id}
          columns={[
            { label: t('imagings.imaging.code'), key: 'code' },
            { label: t('imagings.imaging.type'), key: 'type' },
            {
              label: t('imagings.imaging.requestedOn'),
              key: 'requestedOn',
              formatter: (row) =>
                row.requestedOn ? format(new Date(row.requestedOn), 'yyyy-MM-dd hh:mm a') : '',
            },
            { label: t('imagings.imaging.patient'), key: 'patient' },
            {
              label: t('imagings.imaging.requestedBy'),
              key: 'requestedBy',
              formatter: (row) => extractUsername(row.requestedBy),
            }, // need to be formated later
            { label: t('imagings.imaging.status'), key: 'status' },
          ]}
          data={imagings}
        />
      </div>
    </>
  )
}

export default ViewImagings
