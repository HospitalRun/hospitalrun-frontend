import { test } from 'qunit';
import moduleForAcceptance from 'hospitalrun/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | custom forms');

test('crud operations on custom-forms', function(assert) {
  let crusts =  ['Thin', 'Deep Dish', 'Flatbread'];
  let desserts = ['Ice Cream', 'Cookies', 'Cake'];
  let toppings =  ['Cheese', 'Pepperoni', 'Mushrooms'];
  let header = ['______________________________'];

  function addField(fieldType, label, values) {
    click('button:contains(Add Field)');
    waitToAppear('.modal-dialog');
    andThen(function() {
      assert.equal(find('.modal-title').text(), 'Add Value', 'Add Value modal displays.');
      select('.custom-field-select', fieldType);
      fillIn('.custom-field-label input', label);
      fillIn('.custom-field-colspan input', '1');
    });
    if (values) {
      click('button:contains(Add Value)');
      andThen(function() {
        fillIn('.custom-field-value:last', 'Delete Me');
      });
      andThen(function() {
        assert.equal(find('.custom-field-value:contains(Delete Me)').length, 0, 'Field value successfully added');
      });
      andThen(function() {
        click('button.delete-field-value');
      });
      andThen(function() {
        assert.equal(find('.custom-field-value:contains(Delete Me)').length, 0, 'Field value successfully deleted');
        values.forEach(function(value) {
          click('button:contains(Add Value)');
          andThen(function() {
            fillIn('.custom-field-value:last', value);
          });
        });
      });
    }
    andThen(function() {
      click('.modal-footer button:contains(Add)');
    });
  }

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
      click('button:contains(new form)');
    });
    andThen(function() {
      assert.equal(find('.view-current-title').text(), 'New Custom Form', 'New custom form edit page displays');
      assert.equal(currentURL(), '/admin/custom-forms/edit/new', 'Navigated to create new custom form');
      fillIn('.custom-form-name input', 'Test Custom Form');
      fillIn('.custom-form-columns input', '2');
      select('.custom-form-type', 'Visit');
      click('.panel-footer button:contains(Add)');
      waitToAppear('.modal-dialog');
    });
    andThen(function() {
      assert.equal(find('.modal-title').text(), 'Form Saved', 'Form is saved');
      addField('Header', 'Create a Pizza', header);
    });
    andThen(function() {
      addField('Checkbox', 'Pizza Toppings', toppings);
    });
    andThen(function() {
      addField('Dropdown', 'Pizza Crust', crusts);
    });
    andThen(function() {
      addField('Radio', 'Dessert', desserts);
    });
    andThen(function() {
      addField('Text', 'Beverage');
    });
    andThen(function() {
      addField('Large Text', 'Special Instructions');
    });
    andThen(function() {
      click('button:contains(Update)');
      waitToAppear('.modal-dialog');
    });
    andThen(function() {
      assert.equal(find('.modal-title').text(), 'Form Saved', 'Form is updated');
      verifyPreview(1);
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
      verifyPreview(2);
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
