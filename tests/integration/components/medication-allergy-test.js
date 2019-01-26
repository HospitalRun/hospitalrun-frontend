import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

const Patient = EmberObject.extend({ allergies: [] });
let patient = Patient.create();
const Allergy = EmberObject.extend();
let allergy = Allergy.create({ name: 'test allergy' });

module('Integration | Component | medication allergy', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.i18n = this.owner.lookup('service:i18n');
  });

  test('allergy component renders with appropriate data', async function(assert) {
    patient.get('allergies').pushObject(allergy);
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    this.set('patient', patient);
    await render(hbs`{{medication-allergy patient=patient}}`);
    let allergyName = allergy.get('name');
    let allergies = patient.get('allergies');
    assert.equal(this.$('.allergy-list span').length, allergies.length, 'renders allergy list with correct list of elements');
    assert.equal(this.$('.allergy-list span').first().text().trim(), allergyName, 'renders allergy name');
  });
});
