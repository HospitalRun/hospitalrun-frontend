import { TextInput, Select, Table } from '@hospitalrun/components'
import { act } from '@testing-library/react'
import { ReactWrapper, mount } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import ViewPricingItems from '../../../billing/view/ViewPricingItems'
import * as ButtonBarProvider from '../../../page-header/button-toolbar/ButtonBarProvider'
import * as titleUtil from '../../../page-header/title/TitleContext'
import PricingItemRepository from '../../../shared/db/PricingItemRepository'
import Permissions from '../../../shared/model/Permissions'
import { PricingItem } from '../../../shared/model/PricingItem'
import { RootState } from '../../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])

describe('View Pricing Items', () => {
  let history: any
  jest.spyOn(titleUtil, 'useUpdateTitle').mockImplementation(() => jest.fn())
  const setButtonToolbarSpy = jest.fn()
  jest.spyOn(ButtonBarProvider, 'useButtonToolbarSetter').mockReturnValue(setButtonToolbarSpy)

  const setup = async (permissions: Permissions[] = []) => {
    history = createMemoryHistory()

    const store = mockStore({
      user: {
        permissions,
      },
    } as any)

    let wrapper: any
    await act(async () => {
      wrapper = await mount(
        <ButtonBarProvider.ButtonBarProvider>
          <Provider store={store}>
            <Router history={history}>
              <titleUtil.TitleProvider>
                <ViewPricingItems />
              </titleUtil.TitleProvider>
            </Router>
          </Provider>
        </ButtonBarProvider.ButtonBarProvider>,
      )
    })

    return { wrapper: wrapper as ReactWrapper }
  }

  describe('Title', () => {
    it('should have call the useUpdateTitle', async () => {
      await setup()
      expect(titleUtil.useUpdateTitle).toHaveBeenCalled()
    })
  })

  describe('Button bar', () => {
    beforeEach(() => {
      setButtonToolbarSpy.mockClear()
    })

    it('should display a button to add a new pricing item', async () => {
      await setup([Permissions.ViewPricingItems, Permissions.AddPricingItems])

      const actualButtons: React.ReactNode[] = setButtonToolbarSpy.mock.calls[0][0]
      expect((actualButtons[0] as any).props.children).toEqual('billing.requests.new')
    })

    it('should not display a button to add a new pricing item if user does not have permissions', async () => {
      await setup([Permissions.ViewPricingItems])

      const actualButtons: React.ReactNode[] = setButtonToolbarSpy.mock.calls[0][0]
      expect(actualButtons).toEqual([])
    })
  })

  describe('Category select', () => {
    const searchPricingItemSpy = jest.spyOn(PricingItemRepository, 'search')

    beforeEach(() => {
      searchPricingItemSpy.mockClear()
    })

    it('should search for pricing items when dropdown changes', async () => {
      const expectedCategory = 'procedure'
      const { wrapper } = await setup([Permissions.ViewPricingItems])

      act(() => {
        const onChange = wrapper.find(Select).prop('onChange') as any
        onChange([expectedCategory])
      })

      expect(searchPricingItemSpy).toHaveBeenCalledTimes(1)
      expect(searchPricingItemSpy).toHaveBeenCalledWith(
        expect.objectContaining({ category: expectedCategory }),
      )
    })
  })

  describe('Search funcionality', () => {
    const searchPricingItemSpy = jest.spyOn(PricingItemRepository, 'search')

    beforeAll(() => {
      jest.useFakeTimers()
    })

    afterAll(() => {
      jest.useRealTimers()
    })

    beforeEach(() => {
      searchPricingItemSpy.mockClear()
    })

    it('should search for pricing items after the search text has not changed for 500 milliseconds', async () => {
      const { wrapper } = await setup([Permissions.ViewPricingItems])
      const expectedSearchText = 'search text'

      act(() => {
        const onChange = wrapper.find(TextInput).prop('onChange') as any
        onChange({
          target: {
            value: expectedSearchText,
          },
          preventDefault: jest.fn(),
        })
      })

      act(() => {
        jest.advanceTimersByTime(500)
      })

      expect(searchPricingItemSpy).toHaveBeenCalled()
      expect(searchPricingItemSpy).toHaveBeenCalledWith(
        expect.objectContaining({ text: expectedSearchText }),
      )
    })

    it('should wait 500 milliseconds after search text has changed for search pricing items', async () => {
      const { wrapper } = await setup([Permissions.ViewPricingItems])
      const expectedSearchText = 'search text'

      act(() => {
        const onChange = wrapper.find(TextInput).prop('onChange') as any
        onChange({
          target: {
            value: expectedSearchText,
          },
          preventDefault: jest.fn(),
        })
      })

      expect(searchPricingItemSpy).not.toHaveBeenCalled()
    })
  })

  describe('Table', () => {
    const expectedPricingItems = [
      {
        id: 'id',
        category: 'imaging',
        name: 'name',
        price: 100,
        expenseTo: 'expense to',
      } as PricingItem,
    ]

    jest.spyOn(PricingItemRepository, 'findAll').mockResolvedValue(expectedPricingItems)

    it('should render a table with data', async () => {
      const { wrapper } = await setup([Permissions.ViewPricingItems])

      const table = wrapper.find(Table)
      const columns = table.prop('columns') as any
      const actions = table.prop('actions') as any
      expect(columns[0]).toEqual(
        expect.objectContaining({ label: 'billing.pricingItem.category', key: 'category' }),
      )
      expect(columns[1]).toEqual(
        expect.objectContaining({ label: 'billing.pricingItem.name', key: 'name' }),
      )
      expect(columns[2]).toEqual(
        expect.objectContaining({ label: 'billing.pricingItem.price', key: 'price' }),
      )
      expect(columns[3]).toEqual(
        expect.objectContaining({ label: 'billing.pricingItem.expenseTo', key: 'expenseTo' }),
      )

      expect(actions[0]).toEqual(expect.objectContaining({ label: 'actions.view' }))
      expect(table.prop('actionsHeaderText')).toEqual('actions.label')
      expect(table.prop('data')).toEqual(expectedPricingItems)
    })

    it('should navigate to the pricing item when the view button is clicked', async () => {
      const { wrapper } = await setup([Permissions.ViewPricingItems])
      const tr = wrapper.find('tr').at(1)

      act(() => {
        const onClick = tr.find('button').prop('onClick') as any
        onClick({ stopPropagation: jest.fn() })
      })

      expect(history.location.pathname).toEqual('/billing/id')
    })
  })
})
