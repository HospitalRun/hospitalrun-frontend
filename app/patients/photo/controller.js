import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from 'ember';
import { translationMacro as t } from 'ember-i18n';

const { computed, get, inject, RSVP, set } = Ember;

export default AbstractEditController.extend({
  addAction: 'addPhoto',
  editTitle: t('patients.titles.editPhoto'),
  modelName: 'photo',
  newTitle: t('patients.titles.addPhoto'),
  newModel: false,
  showUpdateButton: true,

  database: inject.service(),
  editController: inject.controller('patients/edit'),
  filesystem: inject.service(),

  title: computed('model.isNew', function() {
    let isNew = get(this, 'model.isNew');
    if (isNew) {
      return get(this, 'newTitle');
    } else {
      return get(this, 'editTitle');
    }
  }),

  afterUpdate(model) {
    let isNew = get(this, 'newModel');
    let editController = get(this, 'editController');
    if (isNew) {
      let photoFile = get(model, 'photoFile');
      let saveToDir = get(model, 'saveToDir');
      let fileSystem = get(this, 'filesystem');
      let modelName = get(this, 'modelName');
      let pouchDbId = get(this, 'database').getPouchId(get(model, 'id'), modelName);
      fileSystem.addFile(photoFile, saveToDir, pouchDbId).then((fileEntry) => {
        model.setProperties({
          fileName: fileEntry.fullPath,
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
    let photoFile = get(model, 'photoFile');
    let isImage = get(model, 'isImage');
    let isNew = get(model, 'isNew');
    set(this, 'newModel', isNew);
    if (isNew) {
      model.setProperties({
        file: Ember.Object.create({
          content_type: photoFile.type,
          data: photoFile,
          name: 'file'
        }),
        isImage
      });
    }
    return RSVP.resolve();
  },

  actions: {
    cancel() {
      this.send('closeModal');
    }
  }
});
