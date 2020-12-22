import { act } from '@testing-library/react'
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import createMockStore from 'redux-mock-store'

import Billing from '../../billing/Billing'
import AddPricingItem from '../../billing/new/AddPricingItem'
import ViewPricingItem from '../../billing/view/ViewPricingItem'
import ViewPricingItems from '../../billing/view/ViewPricingItems'
import { TitleProvider } from '../../page-header/title/TitleContext'
import Permissions from '../../shared/model/Permissions'
import { RootState } from '../../shared/store'

const mockStore = createMockStore<RootState, any>()
describe('Billing', () => {
  const setup = (route: string, permissions: Permissions[] = []) => {
    const store = mockStore({
      user: {
        permissions,
      },
    } as any)

    let wrapper: any
    act(() => {
      wrapper = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={[route]}>
            <TitleProvider>
              <Billing />
            </TitleProvider>
          </MemoryRouter>
        </Provider>,
      )
    })

    return { wrapper: wrapper as ReactWrapper }
  }

  describe('routing', () => {
    describe('/billing/new', () => {
      it('should render the AddPricingItem screen when /billing/new is accessed', () => {
        const { wrapper } = setup('/billing/new', [Permissions.AddPricingItems])

        const addPricingItemView = wrapper.find(AddPricingItem)
        expect(addPricingItemView.exists()).toBeTruthy()
      })

      it('should not render the AddPricingItem screen if user does not have permissions', () => {
        const { wrapper } = setup('/billing/new')

        const addPricingItemView = wrapper.find(AddPricingItem)
        expect(addPricingItemView.exists()).toBeFalsy()
      })
    })

    describe('/billing/:id', () => {
      it('should render the ViewPricingItem screen when /billing/:id is accessed', () => {
        const { wrapper } = setup('/billing/123', [Permissions.ViewPricingItems])

        const viewPricingItem = wrapper.find(ViewPricingItem)
        expect(viewPricingItem.exists()).toBeTruthy()
      })

      it('should not render the ViewPricingItem if user does not have permissions', () => {
        const { wrapper } = setup('/billing/123')

        const viewPricingItem = wrapper.find(ViewPricingItem)
        expect(viewPricingItem.exists()).toBeFalsy()
      })
    })

    describe('/billing', () => {
      it('should render the ViewPricingItems screen when /billing/ is accessed', () => {
        const { wrapper } = setup('/billing', [Permissions.ViewPricingItems])

        const viewPricingItems = wrapper.find(ViewPricingItems)
        expect(viewPricingItems.exists()).toBeTruthy()
      })

      it('should not render the ViewPricingItems when user does not have permissions', () => {
        const { wrapper } = setup('/billing')

        const viewPricingItems = wrapper.find(ViewPricingItems)
        expect(viewPricingItems.exists()).toBeFalsy()
      })
    })
  })
})
