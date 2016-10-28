import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from 'ember';
import PouchDbMixin from 'hospitalrun/mixins/pouchdb';

const {
  computed,
  isEmpty
} = Ember;

export default AbstractEditController.extend(PouchDbMixin, {
  currentForm: null,
  hideCancelButton: true,
  updateCapability: 'update_config',


  afterUpdate: function() {
    this.displayAlert(this.get('i18n').t('admin.address.titles.optionsSaved'), this.get('i18n').t('admin.address.messages.addressSaved'));
  },

  actions: {
    addForm() {
      let currentForm = Ember.Object.create({
        columns: 1,
        fields: [
          Ember.Object.create()
        ]
      });
      this.set('currentForm', Ember.Object.create(currentForm.get('value')));
      return currentForm;
    },

    addField() {
      let currentForm = this.get('currentForm');
      currentForm.fields.addObject(Ember.Object.create());
    },

    selectForm(customFormId) {
      let model = this.get('model');
      let customForm = model.findBy('id', customFormId);
      this.set('currentForm', customForm);
    }
  },

  formName: computed('currentForm.name', function() {
    let i18n = this.get('i18n');
    let formName = this.get('currentForm.name');
    if (isEmpty(formName)) {
      return i18n.t('admin.customForms.labels.newForm')
    } else {
      return formName;
    }
  }),

  showUpdateButton: computed('currentForm', function() {
    return !isEmpty(this.get('currentForm'));
  })
});
