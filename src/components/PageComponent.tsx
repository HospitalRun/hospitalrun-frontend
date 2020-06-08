import { Button, Select } from '@hospitalrun/components'
import React from 'react'
import { useTranslation } from 'react-i18next'

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
  onPageSizeChange,
}: any) => {
  const { t } = useTranslation()

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
        <Select onChange={onPageSizeChange} defaultValue={defaultPageSize.label}>
          {pageSizes.map((pageSize) => (
            <option key={pageSize.label} value={pageSize.value}>
              {pageSize.label}
            </option>
          ))}
        </Select>
      </div>
    </div>
  )
}
export default PageComponent
