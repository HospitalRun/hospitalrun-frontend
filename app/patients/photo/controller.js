import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import RSVP from 'rsvp';
import EmberObject, { set, get, computed } from '@ember/object';
import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import { translationMacro as t } from 'ember-intl';

export default AbstractEditController.extend({
  addAction: 'addPhoto',
  editTitle: t('patients.titles.editPhoto'),
  fileRequiredMessage: t('patients.messages.photoFileRequired'),
  modelName: 'photo',
  newTitle: t('patients.titles.addPhoto'),
  newModel: false,
  showFileRequired: false,
  showUpdateButton: true,

  database: service(),
  filesystem: service(),

  photoFileNotSet: computed('model.photoFile', function() {
    let model = get(this, 'model');
    let isNew = get(model, 'isNew');
    let photoFile = get(model, 'photoFile');
    return (isNew && isEmpty(photoFile));
  }),

  title: computed('model.isNew', function() {
    let isNew = get(this, 'model.isNew');
    if (isNew) {
      return get(this, 'newTitle');
    } else {
      return get(this, 'editTitle');
    }
  }),

  updateButtonAction: computed('photoFileNotSet', function() {
    let photoFileNotSet = get(this, 'photoFileNotSet');
    if (photoFileNotSet) {
      return 'showFileRequired';
    } else {
      set(this, 'showFileRequired', false);
      return 'update';
    }
  }),

  updateButtonClass: computed('photoFileNotSet', function() {
    let photoFileNotSet = get(this, 'photoFileNotSet');
    if (photoFileNotSet) {
      return 'disabled-btn';
    }
  }),

  afterUpdate(model) {
    let isNew = get(this, 'newModel');
    let editController = get(model, 'editController');
    if (isNew) {
      let photoFile = get(model, 'photoFile');
      let saveToDir = get(model, 'saveToDir');
      let fileSystem = get(this, 'filesystem');
      let modelName = get(this, 'modelName');
      let pouchDbId = get(this, 'database').getPouchId(get(model, 'id'), modelName);
      fileSystem.addFile(photoFile, saveToDir, pouchDbId).then((fileEntry) => {
        model.setProperties({
          localFile: true,
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
        files: [EmberObject.create({
          content_type: photoFile.type,
          data: photoFile,
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
