import { Button, Alert } from '@hospitalrun/components'
import { act } from '@testing-library/react'
import { mount, ReactWrapper } from 'enzyme'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import createMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import AddPricingItem from '../../../billing/new/AddPricingItem'
import { PricingItemError } from '../../../billing/utils/validate-pricingItem'
import * as validatePricingItem from '../../../billing/utils/validate-pricingItem'
import * as titleUtil from '../../../page-header/title/TitleContext'
import SelectWithLabelFormGroup from '../../../shared/components/input/SelectWithLabelFormGroup'
import TextFieldWithLabelFormGroup from '../../../shared/components/input/TextFieldWithLabelFormGroup'
import TextInputWithLabelFormGroup from '../../../shared/components/input/TextInputWithLabelFormGroup'
import PricingItemRepository from '../../../shared/db/PricingItemRepository'
import { PricingItem } from '../../../shared/model/PricingItem'
import { RootState } from '../../../shared/store'

const mockStore = createMockStore<RootState, any>([thunk])

describe('Add Pricing item', () => {
  let validatePricingItemSpy: any
  const updateTitleSpy = jest.fn()
  jest.spyOn(titleUtil, 'useUpdateTitle').mockReturnValue(updateTitleSpy)

  const store = mockStore({
    user: {
      permissions: {},
    },
  } as any)
  const history = createMemoryHistory()
  const setup = async () => {
    let wrapper: any
    await act(async () => {
      wrapper = await mount(
        <Provider store={store}>
          <Router history={history}>
            <titleUtil.TitleProvider>
              <AddPricingItem />
            </titleUtil.TitleProvider>
          </Router>
        </Provider>,
      )
    })

    return { wrapper: wrapper as ReactWrapper }
  }

  it('should have New Pricing Item title', async () => {
    await setup()

    expect(updateTitleSpy).toHaveBeenCalledWith('billing.requests.new')
  })

  it('should render a name input', async () => {
    const { wrapper } = await setup()

    const nameInput = wrapper.find(TextInputWithLabelFormGroup).at(0)

    expect(nameInput.exists()).toBeTruthy()
    expect(nameInput.prop('label')).toEqual('billing.pricingItem.name')
    expect(nameInput.prop('isRequired')).toBeTruthy()
    expect(nameInput.prop('isEditable')).toBeTruthy()
  })

  it('should render a category select input', async () => {
    const { wrapper } = await setup()

    const categorySelectInput = wrapper.find(SelectWithLabelFormGroup).at(0)

    expect(categorySelectInput.exists()).toBeTruthy()
    expect(categorySelectInput.prop('isEditable')).toBeTruthy()
    expect(categorySelectInput.prop('isRequired')).toBeTruthy()
  })

  it('should render a type input', async () => {
    const { wrapper } = await setup()

    const typeInput = wrapper.find(TextInputWithLabelFormGroup).at(1)

    expect(typeInput.exists()).toBeTruthy()
    expect(typeInput.prop('label')).toEqual('billing.pricingItem.type')
    expect(typeInput.prop('isEditable')).toBeTruthy()
  })

  it('should render a price input', async () => {
    const { wrapper } = await setup()

    const priceInput = wrapper.find(TextInputWithLabelFormGroup).at(2)

    expect(priceInput.exists()).toBeTruthy()
    expect(priceInput.prop('label')).toEqual('billing.pricingItem.price')
    expect(priceInput.prop('isRequired')).toBeTruthy()
    expect(priceInput.prop('isEditable')).toBeTruthy()
  })

  it(`should render a 'expense to' input`, async () => {
    const { wrapper } = await setup()

    const expenseToInput = wrapper.find(TextInputWithLabelFormGroup).at(3)

    expect(expenseToInput.exists()).toBeTruthy()
    expect(expenseToInput.prop('label')).toEqual('billing.pricingItem.expenseTo')
    expect(expenseToInput.prop('isEditable')).toBeTruthy()
  })

  it('should render a notes input', async () => {
    const { wrapper } = await setup()

    const notesInput = wrapper.find(TextFieldWithLabelFormGroup).at(0)

    expect(notesInput.exists()).toBeTruthy()
    expect(notesInput.prop('label')).toEqual('billing.pricingItem.notes')
    expect(notesInput.prop('isEditable')).toBeTruthy()
  })

  it('should render a save button', async () => {
    const { wrapper } = await setup()

    const saveButton = wrapper.find(Button).at(0)

    expect(saveButton.exists()).toBeTruthy()
    expect(saveButton.text().trim()).toEqual('actions.save')
  })

  it('should render a cancel button', async () => {
    const { wrapper } = await setup()

    const cancelButton = wrapper.find(Button).at(1)

    expect(cancelButton.exists()).toBeTruthy()
    expect(cancelButton.text().trim()).toEqual('actions.cancel')
  })

  describe('on save', () => {
    let pricingItemRepositorySpy: any
    const expectedPricingItem = {
      id: '1234',
      name: 'expected name',
      price: 100,
      category: 'imaging',
      type: 'expected type',
      expenseTo: 'expected expenseTo',
      notes: 'expected notes',
    } as PricingItem

    beforeEach(() => {
      validatePricingItemSpy.mockRestore()
      pricingItemRepositorySpy = jest
        .spyOn(PricingItemRepository, 'save')
        .mockResolvedValue(expectedPricingItem)
    })

    it('should save the new Pricing Item and navigate to /billing/:id', async () => {
      const { wrapper } = await setup()

      const nameInput = wrapper.find(TextInputWithLabelFormGroup).at(0)
      await act(async () => {
        const onChange = nameInput.prop('onChange') as any
        await onChange({
          target: {
            value: expectedPricingItem.name,
          },
        })
      })

      const categorySelect = wrapper.find(SelectWithLabelFormGroup).at(0)
      await act(async () => {
        const onChange = categorySelect.prop('onChange') as any
        await onChange([expectedPricingItem.category])
      })

      const typeInput = wrapper.find(TextInputWithLabelFormGroup).at(1)
      await act(async () => {
        const onChange = typeInput.prop('onChange') as any
        await onChange({
          target: {
            value: expectedPricingItem.type,
          },
        })
      })

      const priceInput = wrapper.find(TextInputWithLabelFormGroup).at(2)
      await act(async () => {
        const onChange = priceInput.prop('onChange') as any
        await onChange({
          target: {
            value: String(expectedPricingItem.price),
          },
        })
      })

      const expenseToInput = wrapper.find(TextInputWithLabelFormGroup).at(3)
      await act(async () => {
        const onChange = expenseToInput.prop('onChange') as any
        await onChange({
          target: {
            value: expectedPricingItem.expenseTo,
          },
        })
      })

      const notesInput = wrapper.find(TextFieldWithLabelFormGroup).at(0)
      await act(async () => {
        const onChange = notesInput.prop('onChange') as any
        await onChange({
          target: {
            value: expectedPricingItem.notes,
          },
        })
      })

      wrapper.update()

      const saveButton = wrapper.find(Button).at(0)
      await act(async () => {
        const onClick = saveButton.prop('onClick') as any
        await onClick()
      })

      expect(pricingItemRepositorySpy).toHaveBeenCalledWith(
        expect.objectContaining({
          name: expectedPricingItem.name,
          category: expectedPricingItem.category,
          price: expectedPricingItem.price,
          type: expectedPricingItem.type,
          expenseTo: expectedPricingItem.expenseTo,
          notes: expectedPricingItem.notes,
        }),
      )
      expect(history.location.pathname).toEqual('/billing/1234')
    })
  })

  describe('on cancel', () => {
    it('should return to /billing/', async () => {
      const { wrapper } = await setup()

      const cancelButton = wrapper.find(Button).at(1)
      act(() => {
        const onClick = cancelButton.prop('onClick') as any
        onClick()
      })

      expect(history.location.pathname).toEqual('/billing')
    })
  })

  describe('on error', () => {
    const expectedError = {
      itemName: 'billing.requests.error.nameRequired',
      category: 'billing.requests.error.categoryRequired',
      price: 'billing.requests.error.priceRequired',
      message: 'billing.requests.error.unableToAdd',
    } as PricingItemError

    validatePricingItemSpy = jest
      .spyOn(validatePricingItem, 'validateNewPricingItem')
      .mockReturnValue(expectedError)

    it('should render errors', async () => {
      const { wrapper } = await setup()

      const saveButton = wrapper.find(Button).at(0)
      await act(async () => {
        const onClick = saveButton.prop('onClick') as any
        await onClick()
      })

      wrapper.update()

      const alert = wrapper.find(Alert)
      const nameInput = wrapper.find(TextInputWithLabelFormGroup).at(0)
      const categorySelect = wrapper.find(SelectWithLabelFormGroup).at(0)
      const priceInput = wrapper.find(TextInputWithLabelFormGroup).at(2)

      expect(alert.exists()).toBeTruthy()
      expect(alert.prop('message')).toEqual(expectedError.message)
      expect(alert.prop('title')).toEqual('states.error')
      expect(alert.prop('color')).toEqual('danger')

      expect(nameInput.prop('feedback')).toEqual(expectedError.itemName)
      expect(nameInput.prop('isInvalid')).toBeTruthy()

      expect(categorySelect.prop('isInvalid')).toBeTruthy()

      expect(priceInput.prop('feedback')).toEqual(expectedError.price)
      expect(priceInput.prop('isInvalid')).toBeTruthy()
    })
  })
})
