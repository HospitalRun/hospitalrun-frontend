import { inject as controller } from '@ember/controller';
import { inject as service } from '@ember/service';
import { resolve } from 'rsvp';
import { isEmpty } from '@ember/utils';
import { alias } from '@ember/object/computed';
import EmberObject, { set, get, computed } from '@ember/object';
import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import DS from 'ember-data';
import FriendlyId from 'hospitalrun/mixins/friendly-id';
import IncidentStatuses, { CLOSED } from 'hospitalrun/mixins/incident-statuses';
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';
import SelectValues from 'hospitalrun/utils/select-values';
import UserSession from 'hospitalrun/mixins/user-session';
import CustomFormManager from 'hospitalrun/mixins/custom-form-manager';

const { PromiseArray, PromiseObject } = DS;

export default AbstractEditController.extend(IncidentStatuses, FriendlyId, PatientSubmodule, SelectValues, UserSession, CustomFormManager, {
  lookupListsToUpdate: [{
    name: 'incidentDepartmentList',
    property: 'model.department',
    id: 'incident_departments'
  }],
  sequenceName: 'incident',
  sequenceView: 'incident_by_friendly_id',
  updateCapability: 'add_incident',

  database: service(),
  filesystem: service(),
  lookupLists: service(),

  customFormsToAdd: alias('formsForSelect'),
  customFormsToDisplay: alias('formsToDisplay'),
  showAddFormButton: alias('showAddButton'),
  incidentController: controller('incident'),

  canManageIncident: computed('model.{isNew,status}', function() {
    let canManageIncident = this.currentUserCan('manage_incidents');
    let status = get(this, 'model.status');
    let isNew = get(this, 'model.isNew');
    if (isNew || status === CLOSED) {
      canManageIncident = false;
    }
    return canManageIncident;
  }),

  canUpdateStatus: computed('model.isNew', function() {
    let canManageIncident = this.currentUserCan('manage_incidents');
    let isNew = get(this, 'model.isNew');
    return canManageIncident && !isNew;
  }),

  categoryNameList: computed('incidentCategoryList.@each.archived', function() {
    return PromiseArray.create({
      promise: get(this, 'incidentCategoryList').then((categoryList) => {
        return categoryList.map((value) => {
          return {
            id: get(value, 'incidentCategoryName'),
            value: get(value, 'incidentCategoryName')
          };
        });
      })
    });
  }).volatile(),

  incidentCategoryList: computed(function() {
    let lookupLists = get(this, 'lookupLists');
    return lookupLists.getLookupList('incidentCategories');
  }).volatile(),

  incidentDepartmentList: computed('lookupListsLastUpdate', function() {
    let lookupLists = get(this, 'lookupLists');
    return PromiseObject.create({
      promise: lookupLists.getLookupList('incident_departments')
    });
  }).volatile(),

  incidentStatuses: computed(function() {
    return get(this, 'statusList').map((status) => {
      return {
        id: status,
        value: this.getLocalizedStatus(status)
      };
    });
  }),

  itemList: computed('model.categoryName', function() {
    let categoryNameSelected = get(this, 'model.categoryName');
    if (!isEmpty(categoryNameSelected)) {
      return PromiseArray.create({
        promise: get(this, 'incidentCategoryList').then((categoryList) => {
          let incidentCategory = categoryList.findBy('incidentCategoryName', categoryNameSelected);
          return get(incidentCategory, 'incidentCategoryItems');
        })
      });
    }
  }),

  afterUpdate() {
    let intl = get(this, 'intl');
    this.displayAlert(intl.t('incident.titles.incidentSaved'), intl.t('incident.messages.saved'));
  },

  beforeUpdate() {
    let model = get(this, 'model');
    set(model, 'modifiedByDisplayName', this.getUserName(false));
    if (get(model, 'isNew')) {
      return this.generateFriendlyId('incident').then((friendlyId) => {
        set(model, 'friendlyId', friendlyId);
      });

    } else {
      return resolve();
    }
  },

  setupCustomForms() {
    this.set('formType', 'incident');
    this.initFormsForType();
  },

  /**
   * Adds or removes the specified object from the specified list.
   * @param {String} listName The name of the list to operate on.
   * @param {Object} listObject The object to add or removed from the
   * specified list.
   * @param {boolean} removeObject If true remove the object from the list;
   * otherwise add the specified object to the list.
   */
  _updateList(listName, listObject, removeObject) {
    let model = get(this, 'model');
    get(model, listName).then(function(list) {
      if (removeObject) {
        list.removeObject(listObject);
      } else {
        list.addObject(listObject);
      }
      this.send('update', true);
      this.send('closeModal');
    }.bind(this));
  },

  actions: {
    addNote(newNote) {
      this._updateList('notes', newNote);
    },

    addAttachment(newAttachment) {
      this._updateList('incidentAttachments', newAttachment);
    },

    addCustomForm() {
      this.send('openModal', 'custom-form-add', EmberObject.create({
        modelToAddTo: this.get('model'),
        customForms: this.get('customFormsToAdd')
      }));
    },

    showAddAttachment() {
      let newNote = get(this, 'store').createRecord('attachment', {
        dateAdded: new Date(),
        addedBy: this.getUserName(true),
        addedByDisplayName: this.getUserName(false),
        saveToDir: `/incidents/${get(this, 'model.id')}/`
      });
      this.send('openModal', 'incident.attachment', newNote);
    },

    showAddNote() {
      let newNote = get(this, 'store').createRecord('incident-note', {
        dateRecorded: new Date(),
        givenBy: this.getUserName(true),
        givenByDisplayName: this.getUserName(false)
      });
      this.send('openModal', 'incident.note.edit', newNote);
    },

    deleteAttachment(model) {
      let attachment = get(model, 'itemToDelete');
      this._updateList('incidentAttachments', attachment, true);
      attachment.destroyRecord().then(() => {
        let attachmentId = get(attachment, 'id');
        let database = get(this, 'database');
        let filePath = get(attachment, 'fileName');
        let fileSystem = get(this, 'filesystem');
        let isFileSystemEnabled = get(fileSystem, 'isFileSystemEnabled');
        if (isFileSystemEnabled) {
          let pouchDbId = database.getPouchId(attachmentId, 'attachment');
          fileSystem.deleteFile(filePath, pouchDbId).catch((/* ignored */) => {});
        }
      });
    },

    deleteNote(note) {
      this._updateList('notes', note, true);
    },

    showDeleteAttachment(attachment) {
      let intl = get(this, 'intl');
      let modelName = intl.t('models.attachment.names.singular');
      let message = intl.t('messages.delete_singular', { name: modelName });
      let model = EmberObject.create({
        itemToDelete: attachment
      });
      let title = intl.t('incident.titles.deleteAttachment');
      this.displayConfirm(title, message, 'deleteAttachment', model);
    },

    showDeleteNote(note) {
      this.send('openModal', 'incident.note.delete', note);
    },

    showEditAttachment(attachment) {
      this.send('openModal', 'incident.attachment', attachment);
    },

    showEditNote(note) {
      this.send('openModal', 'incident.note.edit', note);
    }

  }

});
