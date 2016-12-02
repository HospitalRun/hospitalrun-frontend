import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

const Patient = Ember.Object.extend({ allergies: [] });
let patient = Patient.create();
const Allergy = Ember.Object.extend();
let allergy = Allergy.create({ name: 'test allergy' });

moduleForComponent('medication-allergy', 'Integration | Component | medication allergy', {
  integration: true,
  beforeEach() {
    this.inject.service('i18n');
  }
});

test('allergy component renders with appropriate data', function(assert) {
  patient.get('allergies').pushObject(allergy);
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
  this.set('patient', patient);
  this.render(hbs`{{medication-allergy patient=patient}}`);
  let allergyName = allergy.get('name');
  assert.equal(this.$('.allergy-list li').length, 2, 'renders with appropriate list elements');
  assert.equal(this.$('.allergy-list li').first().text().trim(), 'Add New Allergy', 'renders with add button');
  assert.equal(this.$('.allergy-list li:nth-child(2)').text().trim(), allergyName, 'renders allergy button');
});
