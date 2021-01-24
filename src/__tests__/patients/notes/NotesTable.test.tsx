import { mount, ReactWrapper } from 'enzyme'
import NotesTable from '../../../incidents/view/NotesTable'
import React from 'react'
import { act } from 'react-dom/test-utils'
import Note from '../../../shared/model/Note'
import { Alert, Table } from '@hospitalrun/components'
describe('Notes Table', () => {
    
    const setup = async (notes: Note[]) => {
        
        let wrapper: any
        await act(async () => {
        wrapper = await mount(
            <NotesTable 
                onEditNote={() => {}}
                onDeleteNote={() => {}}
                notes={notes}
            />
        )
        })
        wrapper.update()
        return { wrapper: wrapper as ReactWrapper, history }
    }
    
    it('should render a notes table if at least note is in list.', async () => {    
        const { wrapper } = await setup([{
            id: '1234',
            date: new Date().toISOString(),
            text: 'some text',
            givenBy: 'some user',
        }]);
        expect(wrapper.find(Table)).toHaveLength(1)
    })
    it('should display edit and delete buttons if notes exist', async () => {
        const expectedNote = {
            id: '1234',
            date: new Date().toISOString(),
            text: 'some12324 text',
            givenBy: 'some user',
        } as Note
    })
    it('should display no notes message if no notes exist', async () => {
        const { wrapper } = await setup([]);
        const alert = wrapper.find(Alert)
        expect(alert).toHaveLength(1)
        expect(alert.prop("color")).toEqual("warning")
        expect(alert.prop("title")).toEqual("patient.notes.warning.noNotes")
        expect(wrapper.find(Table)).toHaveLength(0)
    })
    it('calls on edit note when edit note button clicked', async () => {

    })
    it('calls on delete note when edit note button clicked', async () => {

    })
    it('should format the data correctly', async () => {
    })
})