import AbstractModel from 'hospitalrun/models/abstract';
import Ember from 'ember';
import DS from 'ember-data';

const { computed, get } = Ember;

export default AbstractModel.extend({
  // Attributes
  attribution: DS.attr('string'),
  content: DS.attr('string'),
  createdBy: DS.attr('string'),
  date: DS.attr('date'),
  noteType: DS.attr(), // custom list of noteTypes of mixins/patient-note-types
  // Associations
  patient: DS.belongsTo('patient', { async: false }), // who is this note about?
  visit: DS.belongsTo('visit', { async: false }), // if this note is related to a visit, make sure it's noted.
  authoredBy: computed('attribution', 'createdBy', function() {
    if (!Ember.isEmpty(get(this, 'attribution'))) {
      return `${this.get('createdBy')} ${get(this, 'i18n').t('patients.notes.onBehalfOfCopy')} ${this.get('attribution')}`;
    } else {
      return get(this,  'createdBy');
    }
  }),
  validations: {
    patient: {
      presence: true
    },
    visit: {
      presence: true
    },
    noteType: {
      presence: true
    },
    content: {
      presence: true
    }
  }
});
