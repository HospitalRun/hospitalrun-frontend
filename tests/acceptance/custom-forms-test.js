import { click, currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import jquerySelect from 'hospitalrun/tests/helpers/deprecated-jquery-select';
import { setupApplicationTest } from 'ember-qunit';
import runWithPouchDump from 'hospitalrun/tests/helpers/run-with-pouch-dump';
import { createCustomFormForType } from 'hospitalrun/tests/helpers/scenarios/custom-forms';
import { waitToAppear } from 'hospitalrun/tests/helpers/wait-to-appear';
import { authenticateUser } from 'hospitalrun/tests/helpers/authenticate-user';

module('Acceptance | custom forms', function(hooks) {
  setupApplicationTest(hooks);

  test('crud operations on custom-forms', function(assert) {
    let crusts =  ['Thin', 'Deep Dish', 'Flatbread'];
    let desserts = ['Ice Cream', 'Cookies', 'Cake'];
    let toppings =  ['Cheese', 'Pepperoni', 'Mushrooms'];
    let header = ['______________________________'];

    async function verifyPreview() {
      await click(jquerySelect('button:contains(Preview)'));
      await waitToAppear('.form-preview');
      assert.equal($('.form-preview label:contains(Create a Pizza)').length, 1, 'Found Create a Pizza Label');
      assert.equal($(`.form-preview label:contains(${header})`).length, 1, `Found ${header} Label`);
      assert.equal($('.form-preview label:contains(Pizza Toppings)').length, 1, 'Found Pizza Toppings Label');
      toppings.forEach((topping) => {
        assert.equal($(`.form-preview label:contains(${topping}):has(input[type=checkbox])`).length, 1, `Found ${topping} checkbox`);
      });
      assert.equal($('.form-preview label:contains(Pizza Crust)').length, 1, 'Found Pizza Toppings Label');
      crusts.forEach((crust) => {
        assert.equal($(`.form-preview option:contains(${crust})`).length, 1, `Found ${crust} option`);
      });
      assert.equal($('.form-preview label:contains(Dessert)').length, 1, 'Found Pizza Toppings Label');
      desserts.forEach((dessert) => {
        assert.equal($(`.form-preview label:contains(${dessert}):has(input[type=radio])`).length, 1, `Found ${dessert} radio option`);
      });

      assert.equal($('.form-preview label:contains(Beverage)').length, 1, 'Found Beverage Label');
      assert.dom('.form-preview input[id*=beverage]').exists({ count: 1 }, 'Found Beverage input');
      assert.equal($('.form-preview label:contains(Special Instructions)').length, 1, 'Found Special Instructions Label');
      assert.dom('.form-preview textarea[id*=specialInstructions]').exists({ count: 1 }, 'Found special instructions textarea');
      await click(jquerySelect('button:contains(Preview)')); // Hide preview to reset it back to being closed.
    }

    return runWithPouchDump('default', async function() {
      await authenticateUser();
      await visit('/admin/custom-forms');
      assert.equal(currentURL(), '/admin/custom-forms', 'Navigated to custom forms index page');
      assert.dom('.custom-form-name').doesNotExist('No custom forms appears in the listing.');

      await createCustomFormForType('Visit', false, assert);
      await verifyPreview();
      await click(jquerySelect('button:contains(Return)'));
      await waitToAppear('.view-current-title:contains(Custom Forms)');
      assert.equal($('.custom-form-name:contains(Test Custom Form)').length, 1, 'Custom form appears in listing.');

      await click(jquerySelect('button:contains(Edit)'));
      await waitToAppear('button:contains(Preview)');
      assert.dom('.view-current-title').hasText('Edit Custom Form', 'Custom form edit page displays');

      await verifyPreview();
      await click(jquerySelect('button:contains(Return)'));
      await waitToAppear('.view-current-title:contains(Custom Forms)');
      await click(jquerySelect('button:contains(Delete)'));
      await waitToAppear('.modal-dialog');
      assert.dom('.modal-title').hasText('Delete Custom Form', 'Delete confirmation displays');

      await click(jquerySelect('.modal-footer button:contains(Ok)'));
      assert.dom('.custom-form-name').doesNotExist('Deleted custom form disappears from custom form listing.');
    });
  });

  test('switching between pages with custom forms happens without errors', function(assert) {
    return runWithPouchDump('default', async function() {
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
});
