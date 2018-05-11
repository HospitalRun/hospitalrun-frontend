import { test } from 'qunit';
import moduleForAcceptance from 'hospitalrun/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | custom forms');

test('crud operations on custom-forms', function(assert) {
  let crusts =  ['Thin', 'Deep Dish', 'Flatbread'];
  let desserts = ['Ice Cream', 'Cookies', 'Cake'];
  let toppings =  ['Cheese', 'Pepperoni', 'Mushrooms'];
  let header = ['______________________________'];

  async function verifyPreview() {
    await click('button:contains(Preview)');
    await waitToAppear('.form-preview');
    assert.equal(find('.form-preview label:contains(Create a Pizza)').length, 1, 'Found Create a Pizza Label');
    assert.equal(find(`.form-preview label:contains(${header})`).length, 1, `Found ${header} Label`);
    assert.equal(find('.form-preview label:contains(Pizza Toppings)').length, 1, 'Found Pizza Toppings Label');
    toppings.forEach((topping) => {
      assert.equal(find(`.form-preview label:contains(${topping}):has(input[type=checkbox])`).length, 1, `Found ${topping} checkbox`);
    });
    assert.equal(find('.form-preview label:contains(Pizza Crust)').length, 1, 'Found Pizza Toppings Label');
    crusts.forEach((crust) => {
      assert.equal(find(`.form-preview option:contains(${crust})`).length, 1, `Found ${crust} option`);
    });
    assert.equal(find('.form-preview label:contains(Dessert)').length, 1, 'Found Pizza Toppings Label');
    desserts.forEach((dessert) => {
      assert.equal(find(`.form-preview label:contains(${dessert}):has(input[type=radio])`).length, 1, `Found ${dessert} radio option`);
    });
    assert.equal(find('.form-preview label:contains(Beverage)').length, 1, 'Found Beverage Label');
    assert.dom('.form-preview input[id*=beverage]').exists({ count: 1 }, 'Found Beverage input');
    assert.equal(find('.form-preview label:contains(Special Instructions)').length, 1, 'Found Special Instructions Label');
    assert.dom('.form-preview textarea[id*=specialInstructions]').exists({ count: 1 }, 'Found special instructions textarea');
    await click('button:contains(Preview)'); // Hide preview to reset it back to being closed.
  }

  runWithPouchDump('default', async function() {
    await authenticateUser();
    await visit('/admin/custom-forms');
    assert.equal(currentURL(), '/admin/custom-forms', 'Navigated to custom forms index page');
    assert.dom('.custom-form-name').doesNotExist('No custom forms appears in the listing.');

    await createCustomFormForType('Visit', false, assert);
    await verifyPreview();
    await click('button:contains(Return)');
    await waitToAppear('.view-current-title:contains(Custom Forms)');
    assert.equal(find('.custom-form-name:contains(Test Custom Form)').length, 1, 'Custom form appears in listing.');

    await click('button:contains(Edit)');
    await waitToAppear('button:contains(Preview)');
    assert.dom('.view-current-title').hasText('Edit Custom Form', 'Custom form edit page displays');

    await verifyPreview();
    await click('button:contains(Return)');
    await waitToAppear('.view-current-title:contains(Custom Forms)');
    await click('button:contains(Delete)');
    await waitToAppear('.modal-dialog');
    assert.dom('.modal-title').hasText('Delete Custom Form', 'Delete confirmation displays');

    await click('.modal-footer button:contains(Ok)');
    assert.dom('.custom-form-name').doesNotExist('Deleted custom form disappears from custom form listing.');
  });
});

test('switching between pages with custom forms happens without errors', function(assert) {
  runWithPouchDump('default', async function() {
    await authenticateUser();

    await createCustomFormForType('Patient', true);
    await createCustomFormForType('Lab', true);

    await visit('/patients/edit/new');
    await waitToAppear('h4');
    assert.dom('h4').hasText(
      'Test Custom Form for Patient included',
      'Patient custom form is displayed'
    );

    await visit('/labs/edit/new');
    await waitToAppear('h4');
    assert.dom('h4').hasText('Test Custom Form for Lab included', 'Lab custom form is displayed');
  });
});
