import { Button, Alert } from '@hospitalrun/components'
import { act } from '@testing-library/react'
import { mount, ReactWrapper } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Route, Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { PricingItemError } from '../../../billing/utils/validate-pricingItem'
import * as validatePricingItem from '../../../billing/utils/validate-pricingItem'
import ViewPricingItem from '../../../billing/view/ViewPricingItem'
import * as titleUtil from '../../../page-header/title/TitleContext'
import SelectWithLabelFormGroup from '../../../shared/components/input/SelectWithLabelFormGroup'
import TextFieldWithLabelFormGroup from '../../../shared/components/input/TextFieldWithLabelFormGroup'
import TextInputWithLabelFormGroup from '../../../shared/components/input/TextInputWithLabelFormGroup'
import PricingItemRepository from '../../../shared/db/PricingItemRepository'
import { PricingItem } from '../../../shared/model/PricingItem'
import { RootState } from '../../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])

describe('View Pricing Item', () => {
  let history: any
  const mockPricingItem = {
    id: '1234',
    name: 'expected name',
    category: 'imaging',
    type: 'expected type',
    price: 100,
    expenseTo: 'expense to test',
    notes: 'some test notes',
  } as PricingItem

  const setup = async (pricingItem: PricingItem = mockPricingItem) => {
    jest.resetAllMocks()
    jest.spyOn(PricingItemRepository, 'find').mockResolvedValue(pricingItem)
    jest.spyOn(PricingItemRepository, 'saveOrUpdate').mockResolvedValue(pricingItem)
    jest.spyOn(titleUtil, 'useUpdateTitle').mockImplementation(() => jest.fn())

    const store = mockStore({} as any)

    history = createMemoryHistory()
    history.push(`/billing/${pricingItem.id}`)
    let wrapper: any
    await act(async () => {
      wrapper = await mount(
        <Provider store={store}>
          <Router history={history}>
            <Route path="/billing/:id">
              <ViewPricingItem />
            </Route>
          </Router>
        </Provider>,
      )
    })

    wrapper.update()
    return { wrapper: wrapper as ReactWrapper }
  }

  it('should have called useUpdateTitle hook', async () => {
    await setup()

    expect(titleUtil.useUpdateTitle).toHaveBeenCalled()
  })

  it('should retrieve the requested data', async () => {
    await setup()

    expect(PricingItemRepository.find).toHaveBeenCalledTimes(1)
    expect(PricingItemRepository.find).toHaveBeenCalledWith(mockPricingItem.id)
  })

  describe('page content', () => {
    it('should render name text field', async () => {
      const { wrapper } = await setup()

      const nameInput = wrapper.find(TextInputWithLabelFormGroup).at(0)

      expect(nameInput.exists()).toBeTruthy()
      expect(nameInput.prop('label')).toEqual('billing.pricingItem.name')
      expect(nameInput.prop('value')).toEqual(mockPricingItem.name)
      expect(nameInput.prop('isEditable')).toBeTruthy()
      expect(nameInput.prop('isRequired')).toBeTruthy()
    })

    it('should render category select field', async () => {
      const { wrapper } = await setup()

      const categorySelect = wrapper.find(SelectWithLabelFormGroup).at(0)
      const selectedOption = categorySelect.prop('defaultSelected')?.[0]

      expect(categorySelect.exists()).toBeTruthy()
      expect(categorySelect.prop('label')).toEqual('billing.pricingItem.category')
      expect(selectedOption).toMatchObject(
        expect.objectContaining({ value: mockPricingItem.category }),
      )
      expect(categorySelect.prop('isRequired')).toBeTruthy()
    })

    it('should render a type text field', async () => {
      const { wrapper } = await setup()

      const typeInput = wrapper.find(TextInputWithLabelFormGroup).at(1)

      expect(typeInput.exists()).toBeTruthy()
      expect(typeInput.prop('label')).toEqual('billing.pricingItem.type')
      expect(typeInput.prop('value')).toEqual(mockPricingItem.type)
      expect(typeInput.prop('isEditable')).toBeTruthy()
    })

    it('should render a price input field', async () => {
      const { wrapper } = await setup()

      const priceInput = wrapper.find(TextInputWithLabelFormGroup).at(2)
      const value = Number(priceInput.prop('value'))

      expect(priceInput.exists()).toBeTruthy()
      expect(priceInput.prop('label')).toEqual('billing.pricingItem.price')
      expect(value).toEqual(mockPricingItem.price)
      expect(priceInput.prop('isEditable')).toBeTruthy()
      expect(priceInput.prop('isRequired')).toBeTruthy()
    })

    it(`should render a 'expense To' field`, async () => {
      const { wrapper } = await setup()

      const expenseToInput = wrapper.find(TextInputWithLabelFormGroup).at(3)

      expect(expenseToInput.exists()).toBeTruthy()
      expect(expenseToInput.prop('label')).toEqual('billing.pricingItem.expenseTo')
      expect(expenseToInput.prop('value')).toEqual(mockPricingItem.expenseTo)
      expect(expenseToInput.prop('isEditable')).toBeTruthy()
    })

    it('should render a notes field', async () => {
      const { wrapper } = await setup()

      const notesInput = wrapper.find(TextFieldWithLabelFormGroup).at(0)

      expect(notesInput.exists()).toBeTruthy()
      expect(notesInput.prop('label')).toEqual('billing.pricingItem.notes')
      expect(notesInput.prop('value')).toEqual(mockPricingItem.notes)
      expect(notesInput.prop('isEditable')).toBeTruthy()
    })

    it('should render a Update button', async () => {
      const { wrapper } = await setup()

      const updateButton = wrapper.find(Button).at(0)

      expect(updateButton.exists()).toBeTruthy()
      expect(updateButton.prop('children')).toEqual('actions.update')
      expect(updateButton.prop('color')).toEqual('success')
    })
  })

  describe('on update', () => {
    const expectedPricingItem = {
      name: 'new expected name',
      category: 'procedure',
      type: 'new expected type',
      price: 200,
      expenseTo: 'new expense to test',
      notes: 'new some test notes',
    } as PricingItem

    it('should update the Pricing Item', async () => {
      const { wrapper } = await setup()

      const nameInput = wrapper.find(TextInputWithLabelFormGroup).at(0)
      act(() => {
        const onChange = nameInput.prop('onChange') as any
        onChange({
          target: {
            value: expectedPricingItem.name,
          },
        })
      })

      const categorySelect = wrapper.find(SelectWithLabelFormGroup).at(0)
      act(() => {
        const onChange = categorySelect.prop('onChange') as any
        onChange([expectedPricingItem.category])
      })

      const typeInput = wrapper.find(TextInputWithLabelFormGroup).at(1)
      act(() => {
        const onChange = typeInput.prop('onChange') as any
        onChange({
          target: {
            value: expectedPricingItem.type,
          },
        })
      })

      const priceInput = wrapper.find(TextInputWithLabelFormGroup).at(2)
      act(() => {
        const onChange = priceInput.prop('onChange') as any
        onChange({
          target: {
            value: String(expectedPricingItem.price),
          },
        })
      })

      const expenseToInput = wrapper.find(TextInputWithLabelFormGroup).at(3)
      act(() => {
        const onChange = expenseToInput.prop('onChange') as any
        onChange({
          target: {
            value: expectedPricingItem.expenseTo,
          },
        })
      })

      const notesInput = wrapper.find(TextFieldWithLabelFormGroup).at(0)
      act(() => {
        const onChange = notesInput.prop('onChange') as any
        onChange({
          target: {
            value: expectedPricingItem.notes,
          },
        })
      })

      wrapper.update()

      const updateButton = wrapper.find(Button).at(0)
      await act(async () => {
        const onClick = updateButton.prop('onClick') as any
        await onClick()
      })

      expect(PricingItemRepository.saveOrUpdate).toHaveBeenCalledTimes(1)
      expect(PricingItemRepository.saveOrUpdate).toHaveBeenCalledWith(
        expect.objectContaining(expectedPricingItem),
      )
    })
  })

  describe('on errors', () => {
    const expectedErrors = {
      message: 'billing.requests.error.unableToAdd',
      itemName: 'billing.requests.error.nameRequired',
      category: 'billing.requests.error.categoryRequired',
      price: 'billing.requests.error.priceRequired',
    } as PricingItemError

    it('should render errors', async () => {
      const { wrapper } = await setup()

      jest.spyOn(validatePricingItem, 'validateUpdatePricingItem').mockReturnValue(expectedErrors)

      const updateButton = wrapper.find(Button).at(0)
      await act(async () => {
        const onClick = updateButton.prop('onClick') as any
        await onClick()
      })

      wrapper.update()

      const alert = wrapper.find(Alert)
      const nameInput = wrapper.find(TextInputWithLabelFormGroup).at(0)
      const categorySelect = wrapper.find(SelectWithLabelFormGroup).at(0)
      const priceInput = wrapper.find(TextInputWithLabelFormGroup).at(2)

      expect(alert.exists()).toBeTruthy()
      expect(alert.prop('message')).toEqual('billing.requests.error.unableToAdd')

      expect(nameInput.prop('isInvalid')).toBeTruthy()
      expect(nameInput.prop('feedback')).toEqual('billing.requests.error.nameRequired')
      expect(categorySelect.prop('isInvalid')).toBeTruthy()
      expect(priceInput.prop('isInvalid')).toBeTruthy()
      expect(priceInput.prop('feedback')).toEqual('billing.requests.error.priceRequired')
    })
  })
})
