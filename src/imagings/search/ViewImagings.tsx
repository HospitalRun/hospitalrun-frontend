import { Button, Container, Row } from '@hospitalrun/components'
import React, { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { useButtonToolbarSetter } from '../../page-header/button-toolbar/ButtonBarProvider'
import { useUpdateTitle } from '../../page-header/title/TitleContext'
import useTranslator from '../../shared/hooks/useTranslator'
import Permissions from '../../shared/model/Permissions'
import { RootState } from '../../shared/store'
import ImagingSearchRequest from '../model/ImagingSearchRequest'
import ImagingRequestTable from './ImagingRequestTable'

const ViewImagings = () => {
  const { t } = useTranslator()
  const { permissions } = useSelector((state: RootState) => state.user)
  const history = useHistory()
  const setButtons = useButtonToolbarSetter()
  const updateTitle = useUpdateTitle()
  useEffect(() => {
    updateTitle(t('imagings.label'))
  })
  const [searchRequest, setSearchRequest] = useState<ImagingSearchRequest>({
    status: 'all',
    text: '',
  })

  const getButtons = useCallback(() => {
    const buttons: React.ReactNode[] = []

    if (permissions.includes(Permissions.RequestImaging)) {
      buttons.push(
        <Button
          icon="add"
          onClick={() => history.push('/imaging/new')}
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
    setSearchRequest((previousRequest) => ({ ...previousRequest, status: 'all' }))
  }, [])

  useEffect(() => {
    setButtons(getButtons())
    return () => {
      setButtons([])
    }
  }, [getButtons, setButtons])

  return (
    <Container>
      <Row>
        <ImagingRequestTable searchRequest={searchRequest} />
      </Row>
    </Container>
  )
}

export default ViewImagings
