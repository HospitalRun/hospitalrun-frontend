import AbstractModel from 'hospitalrun/models/abstract';
import Ember from 'ember';
import DS from 'ember-data';

const { computed } = Ember;

export default AbstractModel.extend({
  // Attributes
  /*
   * if the note was written by one person but dictated or
   * given on behalf of another, otherwise, this and createdBy are the same.
   */
  attribution: DS.attr('string'),

  content: DS.attr('string'),
  createdBy: DS.attr('string'),
  date: DS.attr('date'),
  /* custom list of noteTypes of mixins/patient-note-types */
  noteType: DS.attr(),
  /* who is this note about? */
  patient: DS.belongsTo('patient', { async: false }),
  /* if this note is related to a visit, make sure it's noted. */
  visit: DS.belongsTo('visit', { async: false }),

  authoredBy: computed('attribution', 'createdBy', function() {
    if (!Ember.isEmpty(this.get('attribution'))) {
      let i18n = this.get('i18n');
      return `${this.get('createdBy')} ${i18n.t('patients.notes.onBehalfOfCopy')} ${this.get('attribution')}`;
    } else {
      return this.get('createdBy');
    }
  }),

  validations: {
    patient: {
      presence: true
    },
    visit: {
      presence: true
    },
    content: {
      presence: true
    }
  }
});
