import { Button, Select } from '@hospitalrun/components'
import React from 'react'

import useTranslator from '../hooks/useTranslator'

const pageSizes = [
  { label: '25', value: 25 },
  { label: '50', value: 50 },
  { label: '100', value: 100 },
  { label: '200', value: 200 },
  { label: 'All', value: undefined },
]

export const defaultPageSize = pageSizes[0]

const PageComponent = ({
  hasNext,
  hasPrevious,
  pageNumber,
  setPreviousPageRequest,
  setNextPageRequest,
}: any) => {
  const { t } = useTranslator()

  return (
    <div style={{ textAlign: 'center' }}>
      <Button
        key="actions.previous"
        outlined
        disabled={!hasPrevious}
        style={{ float: 'left', marginRight: '5px' }}
        color="success"
        onClick={setPreviousPageRequest}
      >
        {t('actions.previous')}
      </Button>
      <Button
        key="actions.next"
        outlined
        style={{ float: 'left' }}
        disabled={!hasNext}
        color="success"
        onClick={setNextPageRequest}
      >
        {t('actions.next')}
      </Button>
      <div style={{ display: 'inline-block' }}>
        {t('actions.page')} {pageNumber}
      </div>
      <div className="row float-right">
        <Select id="page" options={pageSizes} />
      </div>
    </div>
  )
}
export default PageComponent
