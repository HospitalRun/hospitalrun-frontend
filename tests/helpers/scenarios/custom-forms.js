import select from 'hospitalrun/tests/helpers/select';
import { default as jquerySelect, jqueryLength } from 'hospitalrun/tests/helpers/jquery-select';
import { waitToAppear, waitToDisappear } from 'hospitalrun/tests/helpers/wait-to-appear';
import { click, currentURL, visit, fillIn, settled as wait} from '@ember/test-helpers';

const crusts =  ['Thin', 'Deep Dish', 'Flatbread'];
const desserts = ['Ice Cream', 'Cookies', 'Cake'];
const toppings =  ['Cheese', 'Pepperoni', 'Mushrooms'];
const header = ['______________________________'];

export async function createCustomFormForType(formType, alwaysInclude, assert) {
  async function addField(fieldType, label, values) {
    await click(jquerySelect('button:contains(Add Field)'));
    await waitToAppear('.modal-dialog');

    if (assert) {
      assert.dom('.modal-title').hasText('Add Value', 'Add Value modal displays.');
    }

    await select('.custom-field-select', fieldType);
    await fillIn('.custom-field-label input', label);
    await fillIn('.custom-field-colspan input', '1');

    if (values) {
      if (assert) {
        await click(jquerySelect('button:contains(Add Value)'));
        await fillIn(jquerySelect('.custom-field-value:last'), 'Delete Me');
        assert.equal($('.custom-field-value:contains(Delete Me)').length, 0, 'Field value successfully added');

        await click('button.delete-field-value');
        assert.equal($('.custom-field-value:contains(Delete Me)').length, 0, 'Field value successfully deleted');
      }

      for (let value of values) {
        await click(jquerySelect('button:contains(Add Value)'));
        await fillIn(jquerySelect('.custom-field-value:last'), value);
      }
    }

    await click(jquerySelect('.modal-footer button:contains(Add)'));
  }

  await visit('/admin/custom-forms');
  await click(jquerySelect('button:contains(new form)'));
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

  await click(jquerySelect('.panel-footer button:contains(Add)'));
  await waitToAppear('.modal-dialog');

  if (assert) {
    assert.dom('.modal-title').hasText('Form Saved', 'Form is saved');
  }

  await click(jquerySelect('.modal-footer button:contains(Ok)'));
  await addField('Header', 'Create a Pizza', header);
  await addField('Checkbox', 'Pizza Toppings', toppings);
  await addField('Dropdown', 'Pizza Crust', crusts);
  await addField('Radio', 'Dessert', desserts);
  await addField('Text', 'Beverage');
  await addField('Large Text', 'Special Instructions');
  await click(jquerySelect('button:contains(Update)'));
  await waitToAppear('.modal-dialog');

  if (assert) {
    assert.dom('.modal-title').hasText('Form Saved', 'Form is updated');
  }

  await click(jquerySelect('.modal-footer button:contains(Ok)'));
}

export async function checkCustomFormIsDisplayed(assert, header) {
  await waitToAppear(`h4:contains(${header})`);
  assert.equal(jqueryLength(`h4:contains(${header})`), 1, `Form ${header} is displayed`);

  let formDiv = jquerySelect(`h4:contains(${header}) + .js-custom-form`);

  assert.equal(jqueryLength($(formDiv).find('label:contains(Create a Pizza)')), 1, 'There is a form header');
  assert.equal(jqueryLength($(formDiv).find('label:contains(Pizza Crust)')), 1, 'There is a dropdown header');
  assert.dom(`[id="${jquerySelect($(formDiv).find('select')).id}"]`).exists({ count: 1 }, 'There is a dropdown');
  assert.equal(jqueryLength($(formDiv).find('option')), crusts.length, 'There are options');

  assert.equal(jqueryLength($(formDiv).find('label:contains(Pizza Toppings)')), 1, 'There is a checkbox header');
  assert.equal(jqueryLength($(formDiv).find('input[type=checkbox]')), toppings.length, 'There are checkboxes');

  assert.equal(jqueryLength($(formDiv).find('label:contains(Special Instructions)')), 1, 'There is a textarea header');
  assert.dom('textarea', formDiv).exists({ count: 1 }, 'There is a textarea');

  assert.equal(jqueryLength($(formDiv).find('label:contains(Dessert)')), 1, 'There is a radio header');
  assert.equal(jqueryLength($(formDiv).find('input[type=radio]', formDiv)), desserts.length, 'There are radios');

  assert.equal(jqueryLength($(formDiv).find('label:contains(Beverage)')), 1, 'There is a text header');
  assert.equal(jqueryLength($(formDiv).find('label:contains(Beverage)+input[type=text]')), 1, 'There is a text input');
}

export async function fillCustomForm(header) {
  let formSelector = `h4:contains(${header}) + .js-custom-form`;
  await select('[id="' + jquerySelect(`${formSelector} select`).id + '"]', crusts[2]);
  await click(jquerySelect(`${formSelector} input[type=checkbox]:last`));
  await click(jquerySelect(`${formSelector} input[type=radio]:nth(1)`));
  await fillIn(jquerySelect(`${formSelector} textarea`), `Large text for the form ${header}`);
  await fillIn(jquerySelect(`${formSelector} label:contains(Beverage)+input[type=text]`), `Small text for the form ${header}`);
}

export async function checkCustomFormIsFilled(assert, header) {
  await waitToAppear(`h4:contains(${header})`);
  let formDiv = jquerySelect(`h4:contains(${header}) + .js-custom-form`);
  assert.equal(jqueryLength($(formDiv).find('label:contains(Create a Pizza)')), 1, 'There is a form header');
  assert.dom('select').hasValue(crusts[2], 'There is value in select');
  assert.ok($('input[type=checkbox]:last', formDiv).is(':checked'), 'There is value in checkbox');
  assert.equal($(formDiv).find('input:radio:checked').val(), desserts[1], 'There is value in radio');
  assert.dom(jquerySelect($(formDiv).find('textarea'))).hasValue(`Large text for the form ${header}`, 'There is value in textarea');
  assert.equal($('label:contains(Beverage)+input[type=text]', formDiv).val(), `Small text for the form ${header}`, 'There is value in the input');
}

export async function checkCustomFormIsFilledAndReadonly(assert, header) {
  await waitToAppear(`h4:contains(${header})`);

  let formDiv = jquerySelect(`h4:contains(${header}) + .js-custom-form`);

  assert.equal(jqueryLength($(formDiv).find('label:contains(Create a Pizza)')), 1, 'There is a form header');
  assert.equal(jqueryLength($(formDiv).find(`p:contains(${crusts[2]})`)), 1, 'There is text from select');
  assert.equal(jqueryLength($(formDiv).find(`p:contains(${desserts[1]})`)), 1, 'There is text from radio');
  assert.ok(jqueryLength($(formDiv).find('input[type=checkbox]:last').is(':checked')), 'There is value in checkbox');
  assert.equal(jqueryLength($(formDiv).find(`p:contains(Large text for the form ${header})`)), 1, 'There is text from textarea');
  assert.equal(jqueryLength($(formDiv).find(`p:contains(Small text for the form ${header})`)), 1, 'There is text from input');
}

export async function attachCustomForm(name) {
  await waitToAppear('button:contains(Add Form)');
  await click(jquerySelect('button:contains(Add Form)'));
  await waitToAppear('.modal-dialog');
  await select('.form-to-add', name);
  await click(jquerySelect('.modal-footer button:contains(Add Form)'));
  await waitToDisappear('.modal-dialog');
}
