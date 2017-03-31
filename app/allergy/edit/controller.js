import Ember from 'ember';
import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';

const {
  computed,
  computed: {
    alias
  },
  get,
  inject,
  set
} = Ember;

export default AbstractEditController.extend({

  i18n: inject.service(),
  editController: alias('model.editController'),
  newAllergy: false,

  additionalButtons: computed('model', function() {
    let model = this.get('model');
    let btn = this.get('i18n').t('buttons.delete');
    let isNew = get(model, 'isNew');
    if (!isNew) {
      return [{
        class: 'btn btn-default warning',
        buttonAction: 'deleteAllergy',
        buttonIcon: 'octicon octicon-x',
        buttonText: btn
      }];
    }
  }),

  title: Ember.computed('model', function() {
    let model = this.get('model');
    let i18n = this.get('i18n');
    let isNew = get(model, 'isNew');
    if (!isNew) {
      return i18n.t('allergies.titles.editAllergy');
    } else {
      return i18n.t('allergies.titles.addAllergy');
    }
  }),

  beforeUpdate() {
    let allergy = this.get('model');
    let name = get(this, 'name');
    set(allergy, 'name', name);
    set(this, 'newAllergy', allergy.get('isNew'));
    return Ember.RSVP.Promise.resolve();
  },

  afterUpdate(allergy) {
    let newAllergy = get(this, 'newAllergy');
    if (newAllergy) {
      get(this, 'editController').send('addAllergy', allergy);
      set(this, 'name', '');
    } else {
      this.send('closeModal');
    }
  },

  actions: {
    cancel() {
      this.send('closeModal');
    },

    deleteAllergy() {
      let allergy = get(this, 'model');
      get(this, 'editController').send('deleteAllergy', allergy);
    }
  }
});
