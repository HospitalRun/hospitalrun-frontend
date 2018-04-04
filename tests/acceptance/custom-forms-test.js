import { test } from 'qunit';
import moduleForAcceptance from 'hospitalrun/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | custom forms');

test('crud operations on custom-forms', function(assert) {
  let crusts =  ['Thin', 'Deep Dish', 'Flatbread'];
  let desserts = ['Ice Cream', 'Cookies', 'Cake'];
  let toppings =  ['Cheese', 'Pepperoni', 'Mushrooms'];
  let header = ['______________________________'];

  function verifyPreview() {
    click('button:contains(Preview)');
    waitToAppear('.form-preview');
    andThen(function() {
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
      assert.equal(find('.form-preview input[id*=beverage]').length, 1, 'Found Beverage input');
      assert.equal(find('.form-preview label:contains(Special Instructions)').length, 1, 'Found Special Instructions Label');
      assert.equal(find('.form-preview textarea[id*=specialInstructions]').length, 1, 'Found special instructions textarea');
      click('button:contains(Preview)'); // Hide preview to reset it back to being closed.
    });
  }

  runWithPouchDump('default', function() {
    authenticateUser();
    visit('/admin/custom-forms');
    andThen(function() {
      assert.equal(currentURL(), '/admin/custom-forms', 'Navigated to custom forms index page');
      assert.equal(find('.custom-form-name').length, 0, 'No custom forms appears in the listing.');
    });
    andThen(function() {
      createCustomFormForType('Visit', false, assert);
    });
    andThen(function() {
      verifyPreview();
    });
    andThen(function() {
      click('button:contains(Return)');
      waitToAppear('.view-current-title:contains(Custom Forms)');
    });
    andThen(function() {
      assert.equal(find('.custom-form-name:contains(Test Custom Form)').length, 1, 'Custom form appears in listing.');
      click('button:contains(Edit)');
      waitToAppear('button:contains(Preview)');
    });
    andThen(function() {
      assert.equal(find('.view-current-title').text(), 'Edit Custom Form', 'Custom form edit page displays');
      verifyPreview();
    });
    andThen(function() {
      click('button:contains(Return)');
      waitToAppear('.view-current-title:contains(Custom Forms)');
    });
    andThen(function() {
      click('button:contains(Delete)');
      waitToAppear('.modal-dialog');
    });
    andThen(function() {
      assert.equal(find('.modal-title').text(), 'Delete Custom Form', 'Delete confirmation displays');
      click('.modal-footer button:contains(Ok)');
    });
    andThen(function() {
      assert.equal(find('.custom-form-name').length, 0, 'Deleted custom form disappears from custom form listing.');
    });

  });
});

test('switching between pages with custom forms happens without errors', function(assert) {
  runWithPouchDump('default', function() {
    authenticateUser();

    createCustomFormForType('Patient', true);
    createCustomFormForType('Lab', true);

    visit('/patients/edit/new');
    waitToAppear('h4');
    andThen(function() {
      assert.equal(find('h4').text(), 'Test Custom Form for Patient included', 'Patient custom form is displayed');
    });

    visit('/labs/edit/new');
    waitToAppear('h4');
    andThen(function() {
      assert.equal(find('h4').text(), 'Test Custom Form for Lab included', 'Lab custom form is displayed');
    });
  });
});
