import { Promise as EmberPromise } from 'rsvp';
import { alias } from '@ember/object/computed';
import { computed } from '@ember/object';
import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';

export default AbstractEditController.extend({
  updateCapability: 'add_diagnosis',
  editController: alias('model.editController'),
  diagnosisList: alias('editController.diagnosisList'),
  newDiagnosis: false,

  lookupListsToUpdate: [{
    name: 'diagnosisList',
    property: 'model.diagnosis',
    id: 'diagnosis_list'
  }],

  additionalButtons: computed('model.isNew', function() {
    let intl = this.get('intl');
    let isNew = this.get('model.isNew');
    if (!isNew) {
      return [{
        class: 'btn btn-default warning',
        buttonAction: 'deleteDiagnosis',
        buttonIcon: 'octicon octicon-x',
        buttonText: i8n.t('buttons.delete')
      }];
    }
  }),

  canDeleteDiagnosis: computed(function() {
    return this.currentUserCan('delete_diagnosis');
  }),

  title: computed('model.isNew', function() {
    let intl = this.get('intl');
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
    return EmberPromise.resolve();
  },

  actions: {
    cancel() {
      this.send('closeModal');
    },

    deleteDiagnosis() {
      let diagnosis = this.get('model');
      this.get('editController').send('deleteDiagnosis', diagnosis);
    }
  }
});
