const crusts =  ['Thin', 'Deep Dish', 'Flatbread'];
const desserts = ['Ice Cream', 'Cookies', 'Cake'];
const toppings =  ['Cheese', 'Pepperoni', 'Mushrooms'];
const header = ['______________________________'];

export async function createCustomFormForType(formType, alwaysInclude, assert) {
  async function addField(fieldType, label, values) {
    await click('button:contains(Add Field)');
    await waitToAppear('.modal-dialog');
    if (assert) {
      assert.dom('.modal-title').hasText('Add Value', 'Add Value modal displays.');
    }

    select('.custom-field-select', fieldType);
    fillIn('.custom-field-label input', label);
    fillIn('.custom-field-colspan input', '1');

    if (values) {
      if (assert) {
        await click('button:contains(Add Value)');
        await fillIn('.custom-field-value:last', 'Delete Me');
        assert.equal(find('.custom-field-value:contains(Delete Me)').length, 0, 'Field value successfully added');

        await click('button.delete-field-value');
        assert.equal(find('.custom-field-value:contains(Delete Me)').length, 0, 'Field value successfully deleted');
      }

      for (let value of values) {
        await click('button:contains(Add Value)');
        await fillIn('.custom-field-value:last', value);
      }
    }

    await click('.modal-footer button:contains(Add)');
  }

  await visit('/admin/custom-forms');
  await click('button:contains(new form)');
  if (assert) {
    assert.dom('.view-current-title').hasText('New Custom Form', 'New custom form edit page displays');
    assert.equal(currentURL(), '/admin/custom-forms/edit/new', 'Navigated to create new custom form');
  }

  await fillIn('.custom-form-name input', `Test Custom Form for ${formType} ${alwaysInclude ? '' : 'NOT '}included`);
  await fillIn('.custom-form-columns input', '2');
  await select('.custom-form-type', formType);
  if (alwaysInclude) {
    await click('.js-custom-form-always-include input');
  }
  await click('.panel-footer button:contains(Add)');
  await waitToAppear('.modal-dialog');
  if (assert) {
    assert.dom('.modal-title').hasText('Form Saved', 'Form is saved');
  }

  await click('.modal-footer button:contains(Ok)');
  await addField('Header', 'Create a Pizza', header);
  await addField('Checkbox', 'Pizza Toppings', toppings);
  await addField('Dropdown', 'Pizza Crust', crusts);
  await addField('Radio', 'Dessert', desserts);
  await addField('Text', 'Beverage');
  await addField('Large Text', 'Special Instructions');
  await click('button:contains(Update)');
  await waitToAppear('.modal-dialog');
  if (assert) {
    assert.dom('.modal-title').hasText('Form Saved', 'Form is updated');
  }

  await click('.modal-footer button:contains(Ok)');
}

export async function checkCustomFormIsDisplayed(assert, header) {
  await waitToAppear(`h4:contains(${header})`);
  assert.equal(find(`h4:contains(${header})`).length, 1, `Form ${header} is displayed`);

  let formDiv = find(`h4:contains(${header}) + .js-custom-form`);

  assert.equal(find('label:contains(Create a Pizza)', formDiv).length, 1, 'There is a form header');

  assert.equal(find('label:contains(Pizza Crust)', formDiv).length, 1, 'There is a dropdown header');
  assert.dom('select', formDiv[0]).exists({ count: 1 }, 'There is a dropdown');
  assert.equal(find('option', formDiv).length, crusts.length, 'There are options');

  assert.equal(find('label:contains(Pizza Toppings)', formDiv).length, 1, 'There is a checkbox header');
  assert.equal(find('input[type=checkbox]', formDiv).length, toppings.length, 'There are checkboxes');

  assert.equal(find('label:contains(Special Instructions)', formDiv).length, 1, 'There is a textarea header');
  assert.dom('textarea', formDiv[0]).exists({ count: 1 }, 'There is a textarea');

  assert.equal(find('label:contains(Dessert)', formDiv).length, 1, 'There is a radio header');
  assert.equal(find('input[type=radio]', formDiv).length, desserts.length, 'There are radios');

  assert.equal(find('label:contains(Beverage)', formDiv).length, 1, 'There is a text header');
  assert.equal(find('label:contains(Beverage)+input[type=text]', formDiv).length, 1, 'There is a text input');
}

export async function fillCustomForm(header) {
  let formSelector = `h4:contains(${header}) + .js-custom-form`;
  await select(`${formSelector} select`, crusts[2]);
  await click(`${formSelector} input[type=checkbox]:last`);
  await click(`${formSelector} input[type=radio]:nth(1)`);
  await fillIn(`${formSelector} textarea`, `Large text for the form ${header}`);
  await fillIn(`${formSelector} label:contains(Beverage)+input[type=text]`, `Small text for the form ${header}`);
}

export async function checkCustomFormIsFilled(assert, header) {
  await waitToAppear(`h4:contains(${header})`);

  let formDiv = find(`h4:contains(${header}) + .js-custom-form`);

  assert.equal(find('label:contains(Create a Pizza)', formDiv).length, 1, 'There is a form header');
  assert.dom('select', formDiv[0]).hasValue(crusts[2], 'There is value in select');
  assert.ok(find('input[type=checkbox]:last', formDiv).is(':checked'), 'There is value in checkbox');
  assert.equal(find('input:radio:checked', formDiv).val(), desserts[1], 'There is value in radio');
  assert.dom('textarea', formDiv[0]).hasValue(`Large text for the form ${header}`, 'There is value in textarea');
  assert.equal(find('label:contains(Beverage)+input[type=text]', formDiv).val(), `Small text for the form ${header}`, 'There is value in the input');
}

export async function checkCustomFormIsFilledAndReadonly(assert, header) {
  await waitToAppear(`h4:contains(${header})`);

  let formDiv = find(`h4:contains(${header}) + .js-custom-form`);

  assert.equal(find('label:contains(Create a Pizza)', formDiv).length, 1, 'There is a form header');
  assert.equal(find(`p:contains(${crusts[2]})`, formDiv).length, 1, 'There is text from select');
  assert.equal(find(`p:contains(${desserts[1]})`, formDiv).length, 1, 'There is text from radio');
  assert.ok(find('input[type=checkbox]:last', formDiv).is(':checked'), 'There is value in checkbox');
  assert.equal(find(`p:contains(Large text for the form ${header})`, formDiv).length, 1, 'There is text from textarea');
  assert.equal(find(`p:contains(Small text for the form ${header})`, formDiv).length, 1, 'There is text from input');
}

export async function attachCustomForm(name) {
  await waitToAppear('button:contains(Add Form)');
  await click('button:contains(Add Form)');
  await waitToAppear('.modal-dialog');
  await select('.form-to-add', name);
  await click('.modal-footer button:contains(Add Form)');
  await waitToDisappear('.modal-dialog');
}
