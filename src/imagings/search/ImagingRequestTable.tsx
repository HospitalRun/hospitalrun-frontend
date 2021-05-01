import { Table } from '@hospitalrun/components'
import format from 'date-fns/format'
import React from 'react'

import Loading from '../../shared/components/Loading'
import useTranslator from '../../shared/hooks/useTranslator'
import { extractUsername } from '../../shared/util/extractUsername'
import useImagingSearch from '../hooks/useImagingSearch'
import ImagingSearchRequest from '../model/ImagingSearchRequest'

interface Props {
  searchRequest: ImagingSearchRequest
}

const ImagingRequestTable = (props: Props) => {
  const { searchRequest } = props
  const { t } = useTranslator()
  const { data, status } = useImagingSearch(searchRequest)

  if (data === undefined || status === 'loading') {
    return <Loading />
  }

  return (
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
          formatter: (row) => extractUsername(row.requestedByFullName || ''),
        },
        { label: t('imagings.imaging.status'), key: 'status' },
      ]}
      data={data}
    />
  )
}

export default ImagingRequestTable
