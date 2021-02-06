import { Alert, Table } from '@hospitalrun/components'
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'

import NotesTable from '../../../incidents/view/NotesTable'
import Note from '../../../shared/model/Note'

describe('Notes Table', () => {
  const setup = async (notes: Note[]) => {
    const onEditSpy = jest.fn()
    const onDeleteSpy = jest.fn()

    let wrapper: any
    await act(async () => {
      wrapper = await mount(
        <NotesTable onEditNote={onEditSpy} onDeleteNote={onDeleteSpy} notes={notes} />,
      )
    })
    wrapper.update()
    return { wrapper: wrapper as ReactWrapper, onEditSpy, onDeleteSpy }
  }

  it('should render a notes table if at least note is in list.', async () => {
    const { wrapper } = await setup([
      {
        id: '1234',
        date: new Date().toISOString(),
        text: 'some text',
        givenBy: 'some user',
      },
    ])
    expect(wrapper.find(Table)).toHaveLength(1)
  })
  it('should display edit and delete buttons if notes exist', async () => {
    const { wrapper } = await setup([
      {
        id: '1234',
        date: new Date().toISOString(),
        text: 'some text',
        givenBy: 'some user',
      },
    ])
    const notesTable = wrapper.find(Table)
    expect(notesTable.prop('actions')).toEqual([
      expect.objectContaining({ label: 'actions.edit', buttonColor: 'dark' }),
      expect.objectContaining({ label: 'actions.delete', buttonColor: 'danger' }),
    ])
  })
  it('should display no notes message if no notes exist', async () => {
    const { wrapper } = await setup([])
    const alert = wrapper.find(Alert)
    expect(alert).toHaveLength(1)
    expect(alert.prop('color')).toEqual('warning')
    expect(alert.prop('title')).toEqual('patient.notes.warning.noNotes')
    expect(wrapper.find(Table)).toHaveLength(0)
  })
  it('calls on edit note when edit note button clicked', async () => {
    const { wrapper, onEditSpy } = await setup([
      {
        id: '1234',
        date: new Date().toISOString(),
        text: 'some text',
        givenBy: 'some user',
      },
    ])
    act(() => {
      const table = wrapper.find(Table) as any
      const onViewClick = table.prop('actions')[0].action as any
      onViewClick()
    })

    expect(onEditSpy).toHaveBeenCalledTimes(1)
  })
  it('calls on delete note when edit note button clicked', async () => {
    const { wrapper, onDeleteSpy } = await setup([
      {
        id: '1234',
        date: new Date().toISOString(),
        text: 'some text',
        givenBy: 'some user',
      },
    ])
    act(() => {
      const table = wrapper.find(Table) as any
      const onViewClick = table.prop('actions')[1].action as any
      onViewClick()
    })

    expect(onDeleteSpy).toHaveBeenCalledTimes(1)
  })
})
