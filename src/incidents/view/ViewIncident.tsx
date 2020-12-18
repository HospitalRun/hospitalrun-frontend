import { Button, Tab, Panel, TabsHeader } from '@hospitalrun/components'
import React from 'react'
import { useSelector } from 'react-redux'
import { useParams, useHistory, useLocation } from 'react-router-dom'

import useAddBreadcrumbs from '../../page-header/breadcrumbs/useAddBreadcrumbs'
import { useUpdateTitle } from '../../page-header/title/TitleContext'
import useTranslator from '../../shared/hooks/useTranslator'
import { RootState } from '../../shared/store'
import Permissions from '../../shared/model/Permissions'
import ViewIncidentDetails from './ViewIncidentDetails'
import useIncident from '../hooks/useIncident'
import useResolveIncident from '../hooks/useResolveIncident'
import NotesTable from './NotesTable'

const ViewIncident = () => {
  const { id } = useParams() as any
  const { permissions } = useSelector((root: RootState) => root.user)
  const { data, isLoading } = useIncident(id)
  const [mutate] = useResolveIncident()
  const location = useLocation()
  const history = useHistory()
  const { t } = useTranslator()
  const updateTitle = useUpdateTitle()
  updateTitle(t('incidents.reports.view'))
  useAddBreadcrumbs([
    {
      i18nKey: 'incidents.reports.view',
      location: `/incidents/${id}`,
    },
  ])

  if (id === undefined || permissions === undefined) {
    return <></>
  }

  const onResolve = async () => {
    await mutate(data)
    history.push('/incidents')
  }

  return (
    <div>
      <ViewIncidentDetails isLoading={isLoading} incident={data} />
      <TabsHeader>
        <Tab
          active={location.pathname === `/incidents/${id}/notes`}
          label={t('patient.notes.label')}
          onClick={() => history.push(`/incidents/${id}/notes`)}
        />
      </TabsHeader>
      <Panel>
        <div className="col-md-12 d-flex justify-content-end">
          <Button outlined color="success" icon="add" iconLocation="right">
            {t('patient.notes.new')}
          </Button>
        </div>
        <NotesTable />
      </Panel>
      {data &&
        data.resolvedOn === undefined &&
        data.status !== 'resolved' &&
        permissions.includes(Permissions.ResolveIncident) && (
          <div className="row float-right">
            <div className="btn-group btn-group-lg mt-3">
              <Button
                className="mr-2"
                onClick={onResolve}
                color="primary"
                key="incidents.reports.resolve"
              >
                {t('incidents.reports.resolve')}
              </Button>
            </div>
          </div>
        )}
    </div>
  )
}

export default ViewIncident
