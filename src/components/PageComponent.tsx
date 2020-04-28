import React from 'react'
import { Button } from '@hospitalrun/components'
import { useTranslation } from 'react-i18next'

const PageComponent = ({
  hasNext,
  hasPrevious,
  pageNumber,
  setPreviousPageRequest,
  setNextPageRequest,
}: any) => {
  const { t } = useTranslation()

  return (
    <div style={{ textAlign: 'center' }}>
      <Button
        key="actions.previous"
        outlined
        disabled={!hasPrevious}
        style={{ float: 'left' }}
        color="success"
        onClick={setPreviousPageRequest}
      >
        {t('actions.previous')}
      </Button>
      <div style={{ display: 'inline-block' }}>
        {t('actions.page')} {pageNumber}
      </div>
      <Button
        key="actions.next"
        outlined
        style={{ float: 'right' }}
        disabled={!hasNext}
        color="success"
        onClick={setNextPageRequest}
      >
        {t('actions.next')}
      </Button>
    </div>
  )
}
export default PageComponent
