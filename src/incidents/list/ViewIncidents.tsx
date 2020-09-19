import { Button } from '@hospitalrun/components'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { useButtonToolbarSetter } from '../../page-header/button-toolbar/ButtonBarProvider'
import useTitle from '../../page-header/title/useTitle'
import SelectWithLabelFormGroup, {
  Option,
} from '../../shared/components/input/SelectWithLabelFormGroup'
import useTranslator from '../../shared/hooks/useTranslator'
import IncidentFilter from '../IncidentFilter'
import ViewIncidentsTable from './ViewIncidentsTable'

const ViewIncidents = () => {
  const { t } = useTranslator()
  const history = useHistory()
  const setButtonToolBar = useButtonToolbarSetter()
  useTitle(t('incidents.reports.label'))
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

  const filterOptions: Option[] = Object.values(IncidentFilter).map((filter) => ({
    label: t(`incidents.status.${filter}`),
    value: `${filter}`,
  }))

  return (
    <>
      <div className="row">
        <div className="col-md-3 col-lg-2">
          <SelectWithLabelFormGroup
            name="type"
            label={t('incidents.filterTitle')}
            options={filterOptions}
            defaultSelected={filterOptions.filter(({ value }) => value === searchFilter)}
            onChange={(values) => setSearchFilter(values[0] as IncidentFilter)}
            isEditable
          />
        </div>
      </div>
      <div className="row">
        <ViewIncidentsTable searchRequest={{ status: searchFilter }} />
      </div>
    </>
  )
}

export default ViewIncidents
