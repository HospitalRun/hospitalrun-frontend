import { Select, Label, Button, Container, Row, Column } from '@hospitalrun/components'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { useButtonToolbarSetter } from '../../page-header/button-toolbar/ButtonBarProvider'
import { useUpdateTitle } from '../../page-header/title/TitleContext'
import { SelectOption } from '../../shared/components/input/SelectOption'
import useTranslator from '../../shared/hooks/useTranslator'
import IncidentFilter from '../IncidentFilter'
import ViewIncidentsTable from './ViewIncidentsTable'

const ViewIncidents = () => {
  const { t } = useTranslator()
  const history = useHistory()
  const setButtonToolBar = useButtonToolbarSetter()
  const updateTitle = useUpdateTitle()
  useEffect(() => {
    updateTitle(t('incidents.reports.label'))
  })
  const [searchFilter, setSearchFilter] = useState(IncidentFilter.reported)

  useEffect(() => {
    setButtonToolBar([
      <Button
        key="newIncidentButton"
        outlined
        color="success"
        icon="add"
        onClick={() => history.push('/incidents/new')}
      >
        {t('incidents.reports.new')}
      </Button>,
    ])

    return () => {
      setButtonToolBar([])
    }
  }, [setButtonToolBar, t, history])

  const filterOptions: SelectOption[] = Object.values(IncidentFilter).map((filter) => ({
    label: t(`incidents.status.${filter}`),
    value: `${filter}`,
  }))

  return (
    <Container>
      <Row>
        <Column md={3} lg={2}>
          <Label text={t('incidents.filterTitle')} title="type" />
          <Select
            id="type"
            options={filterOptions}
            defaultSelected={filterOptions.filter(({ value }) => value === searchFilter)}
            onChange={(values) => setSearchFilter(values[0] as IncidentFilter)}
            disabled={false}
          />
        </Column>
      </Row>
      <Row>
        <ViewIncidentsTable searchRequest={{ status: searchFilter }} />
      </Row>
    </Container>
  )
}

export default ViewIncidents
