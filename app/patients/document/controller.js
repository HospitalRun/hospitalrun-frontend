import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from 'ember';
import { translationMacro as t } from 'ember-i18n';

const { computed, get, inject, isEmpty, RSVP, set } = Ember;

export default AbstractEditController.extend({
  addAction: 'addDocument',
  editTitle: t('patients.titles.editDocument'),
  fileRequiredMessage: t('patients.messages.documentFileRequired'),
  modelName: 'document',
  newTitle: t('patients.titles.addDocument'),
  newModel: false,
  showFileRequired: false,
  showUpdateButton: true,

  database: inject.service(),
  filesystem: inject.service(),

  documentFileNotSet: computed('model.documentFile', function() {
    let model = get(this, 'model');
    let isNew = get(model, 'isNew');
    let documentFile = get(model, 'documentFile');
    return (isNew && isEmpty(documentFile));
  }),

  title: computed('model.isNew', function() {
    let isNew = get(this, 'model.isNew');
    if (isNew) {
      return get(this, 'newTitle');
    } else {
      return get(this, 'editTitle');
    }
  }),

  updateButtonAction: computed('documentFileNotSet', function() {
    let documentFileNotSet = get(this, 'documentFileNotSet');
    if (documentFileNotSet) {
      return 'showFileRequired';
    } else {
      set(this, 'showFileRequired', false);
      return 'update';
    }
  }),

  updateButtonClass: computed('documentFileNotSet', function() {
    let documentFileNotSet = get(this, 'documentFileNotSet');
    if (documentFileNotSet) {
      return 'disabled-btn';
    }
  }),

  afterUpdate(model) {
    let isNew = get(this, 'newModel');
    let editController = get(model, 'editController');
    if (isNew) {
      let documentFile = get(model, 'documentFile');
      let saveToDir = get(model, 'saveToDir');
      let fileSystem = get(this, 'filesystem');
      let modelName = get(this, 'modelName');
      let pouchDbId = get(this, 'database').getPouchId(get(model, 'id'), modelName);
      fileSystem.addFile(documentFile, saveToDir, pouchDbId).then((fileEntry) => {
        model.setProperties({
          localFile: true,
          fileName: fileEntry.fullPath,
          Name: fileEntry.modelName,
          url: fileEntry.toURL()
        });
        model.save().then(() => {
          editController.send(get(this, 'addAction'), model);
        }).catch((err) => {
          throw err;
        });
      });
    } else {
      this.send('closeModal');
    }
  },

  beforeUpdate() {
    let model = get(this, 'model');
    let documentFile = get(model, 'documentFile');
    let isImage = get(model, 'isImage');
    let isNew = get(model, 'isNew');
    set(this, 'newModel', isNew);
    if (isNew) {
      model.setProperties({
        files: [Ember.Object.create({
          content_type: documentFile.type,
          data: documentFile,
          name: 'file'
        })],
        isImage
      });
    }
    return RSVP.resolve();
  },

  actions: {
    cancel() {
      this.send('closeModal');
    },

    showFileRequired() {
      set(this, 'showFileRequired', true);
    }
  }
});
