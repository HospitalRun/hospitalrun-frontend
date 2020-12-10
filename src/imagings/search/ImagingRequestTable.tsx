import { Container, Row, Column, Table } from '@hospitalrun/components'
import format from 'date-fns/format'
import React, { useState } from 'react'

import SelectWithLabelFormGroup, {
  Option,
} from '../../shared/components/input/SelectWithLabelFormGroup'
import TextInputWithLabelFormGroup from '../../shared/components/input/TextInputWithLabelFormGroup'
import Loading from '../../shared/components/Loading'
import useTranslator from '../../shared/hooks/useTranslator'
import { extractUsername } from '../../shared/util/extractUsername'
import useImagingSearch from '../hooks/useImagingSearch'
import ImagingSearchRequest, { ImagingFilter } from '../model/ImagingSearchRequest'

interface Props {
  searchRequest: ImagingSearchRequest
}

const ImagingRequestTable = (props: Props) => {
  const { searchRequest } = props
  const { t } = useTranslator()
  const { data, status } = useImagingSearch(searchRequest)

  const [searchFilter, setSearchFilter] = useState<ImagingFilter>('all')
  const [searchText, setSearchText] = useState<string>('')

  if (data === undefined || status === 'loading') {
    return <Loading />
  }

  const onSearchBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value)
  }

  const filterOptions: Option[] = [
    { label: t('imagings.status.requested'), value: 'requested' },
    { label: t('imagings.status.completed'), value: 'completed' },
    { label: t('imagings.status.canceled'), value: 'canceled' },
    { label: t('imagings.filter.all'), value: 'all' },
  ]

  return (
    <Container>
      <Row>
        <Column md={3} lg={2}>
          <SelectWithLabelFormGroup
            name="type"
            label={t('imagings.filterTitle')}
            options={filterOptions}
            defaultSelected={filterOptions.filter(({ value }) => value === searchFilter)}
            onChange={(values) => setSearchFilter(values[0] as ImagingFilter)}
            isEditable
          />
        </Column>
        <Column>
          <TextInputWithLabelFormGroup
            name="searchbox"
            label={t('imagings.search')}
            placeholder={t('imagings.searchPlaceholder')}
            value={searchText}
            isEditable
            onChange={onSearchBoxChange}
          />
        </Column>
      </Row>
      <Row>
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
            { label: t('imagings.imaging.patient'), key: 'fullName' },
            {
              label: t('imagings.imaging.requestedBy'),
              key: 'requestedBy',
              formatter: (row) => extractUsername(row.requestedBy),
            },
            { label: t('imagings.imaging.status'), key: 'status' },
          ]}
          data={data}
        />
      </Row>
    </Container>
  )
}

export default ImagingRequestTable
