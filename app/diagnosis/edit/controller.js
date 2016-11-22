import Ember from 'ember';
import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';

const {
  computed
} = Ember;

export default AbstractEditController.extend({
  updateCapability: 'add_diagnosis',
  editController: Ember.computed.alias('model.editController'),
  diagnosisList: Ember.computed.alias('editController.diagnosisList'),
  newDiagnosis: false,

  lookupListsToUpdate: [{
    name: 'diagnosisList',
    property: 'model.diagnosis',
    id: 'diagnosis_list'
  }],

  canDeleteDiagnosis: computed(function() {
    return this.currentUserCan('delete_diagnosis');
  }),

  title: computed('model.isNew', function() {
    let i8n = this.get('i18n');
    let isNew = this.get('model.isNew');
    if (isNew) {
      return i8n.t('diagnosis.titles.addDiagnosis');
    } else {
      return i8n.t('diagnosis.titles.editDiagnosis');
    }
  }),

  afterUpdate(diagnosis) {
    let newDiagnosis = this.get('newDiagnosis');
    if (newDiagnosis) {
      this.get('editController').send('addDiagnosis', diagnosis);
    } else {
      this.send('closeModal');
    }
  },

  beforeUpdate() {
    let diagnosis = this.get('model');
    this.set('newDiagnosis', diagnosis.get('isNew'));
    return Ember.RSVP.Promise.resolve();
  },

  actions: {
    cancel() {
      this.send('closeModal');
    }
  }
});
