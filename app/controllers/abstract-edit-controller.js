import Ember from 'ember';
import EditPanelProps from 'hospitalrun/mixins/edit-panel-props';
import IsUpdateDisabled from 'hospitalrun/mixins/is-update-disabled';
import ModalHelper from 'hospitalrun/mixins/modal-helper';
import { task } from 'ember-concurrency';
import UserSession from 'hospitalrun/mixins/user-session';

const { get, inject, isEmpty, RSVP, set } = Ember;

export default Ember.Controller.extend(EditPanelProps, IsUpdateDisabled, ModalHelper, UserSession, {
  cancelAction: 'allItems',

  cancelButtonText: function() {
    let i18n = get(this, 'i18n');
    let hasDirtyAttributes = get(this, 'model.hasDirtyAttributes');
    if (hasDirtyAttributes) {
      return i18n.t('buttons.cancel');
    } else {
      return i18n.t('buttons.returnButton');
    }
  }.property('model.hasDirtyAttributes'),

  disabledAction: function() {
    let model = get(this, 'model');
    if (model.validate) {
      model.validate().catch(Ember.K);
    }
    let isValid = model.get('isValid');
    if (!isValid) {
      return 'showDisabledDialog';
    }
  }.property('model.isValid'),

  isNewOrDeleted: function() {
    return get(this, 'model.isNew') || get(this, 'model.isDeleted');
  }.property('model.isNew', 'model.isDeleted'),

  lookupLists: inject.service(),
  /**
   *  Lookup lists that should be updated when the model has a new value to add to the lookup list.
   *  lookupListsToUpdate: [{
   *      name: 'countryList', //Name of property containing lookup list
   *      property: 'country', //Corresponding property on model that potentially contains a new value to add to the list
   *      id: 'country_list' //Id of the lookup list to update
   *  }
   */
  lookupListsLastUpdate: null,
  lookupListsToUpdate: null,

  showUpdateButton: function() {
    let updateButtonCapability = get(this, 'updateCapability');
    return this.currentUserCan(updateButtonCapability);
  }.property('updateCapability'),

  updateButtonAction: 'update',
  updateButtonText: function() {
    let i18n = get(this, 'i18n');
    if (get(this, 'model.isNew')) {
      return i18n.t('buttons.add');
    } else {
      return i18n.t('buttons.update');
    }
  }.property('model.isNew'),
  updateCapability: null,

  /* Silently update and then fire the specified action. */
  silentUpdate(action, whereFrom) {
    return this.get('updateTask').perform(true).then(() => {
      this.send(action, whereFrom);
    });
  },

  /**
   * Task to update the model and perform the before update and after update
   * @param skipAfterUpdate boolean (optional) indicating whether or not
   * to skip the afterUpdate call.
   */
  updateTask: task(function* (skipAfterUpdate) {
    try {
      yield this.beforeUpdate().then(() => {
        return this.saveModel(skipAfterUpdate);
      }).catch((err) => {
        return this._handleError(err);
      });
    } catch(ex) {
      this._handleError(ex);
    }
  }).enqueue(),

  /**
   * Add the specified value to the lookup list if it doesn't already exist in the list.
   * @param lookupList array the lookup list to add to.
   * @param value string the value to add.
   * @param listsToUpdate array the lookup lists that need to be saved.
   * @param listsName string name of the list to add the value to.
   */
  _addValueToLookupList(lookupList, value, listsToUpdate, listName) {
    let lookupListValues = lookupList.get('value');
    if (!Ember.isArray(lookupListValues)) {
      lookupListValues = [];
    }
    if (!lookupListValues.includes(value)) {
      lookupListValues.push(value);
      lookupListValues.sort();
      lookupList.set('value', lookupListValues);
      if (!listsToUpdate.includes(lookupList)) {
        listsToUpdate.push(lookupList);
      }
      this.set(listName, lookupList);
    }
  },

  _cancelUpdate() {
    let cancelledItem = get(this, 'model');
    cancelledItem.rollbackAttributes();
  },

  _handleError(err) {
    if (!err.ignore) {
      let i18n = get(this, 'i18n');
      let errorDetails = err;
      if (!errorDetails.message) {
        errorDetails.message =  err.toString();
      }
      this.displayAlert(
        i18n.t('alerts.errorExclamation'),
        i18n.t('messages.saveActionException', errorDetails)
      );
    }
  },

  actions: {
    cancel() {
      this._cancelUpdate();
      this.send(get(this, 'cancelAction'));
    },

    returnTo() {
      this._cancelUpdate();
      let returnTo = get(this, 'model.returnTo');
      let returnToContext = get(this, 'model.returnToContext');
      if (isEmpty(returnToContext)) {
        this.transitionToRoute(returnTo);
      } else {
        this.transitionToRoute(returnTo, returnToContext);
      }
    },

    showDisabledDialog() {
      let i18n = get(this, 'i18n');
      this.displayAlert(
        i18n.t('alerts.warningExclamation'),
        i18n.t('messages.requiredFieldsCorrectErrors')
      );
    },

    /**
     * Update the model and perform the before update and after update
     * @param skipAfterUpdate boolean (optional) indicating whether or not
     * to skip the afterUpdate call.
     */
    update(skipAfterUpdate) {
      return this.get('updateTask').perform(skipAfterUpdate);
    }
  },

  /**
   * Override this function to perform logic after record update
   * @param record the record that was just updated.
   */
  afterUpdate() {},

  /**
   * Override this function to perform logic before record update.
   * @returns {Promise} Promise that resolves after before update is done.
   */
  beforeUpdate() {
    return Ember.RSVP.Promise.resolve();
  },

  /**
   * Save the model and then (optionally) run the after update.
   * @param skipAfterUpdate boolean (optional) indicating whether or not
   * to skip the afterUpdate call.
   */
  saveModel(skipAfterUpdate) {
    return get(this, 'model').save().then((record) => {
      this.updateLookupLists().then(() => {
        if (!skipAfterUpdate) {
          this.afterUpdate(record);
        }
      });
    }).catch((error) => {
      this.send('error', error);
    });
  },

  /**
   * Update any new values added to a lookup list
   */
  updateLookupLists() {
    let lookupListsToUpdate = get(this, 'lookupListsToUpdate');
    let listsToUpdate = Ember.A();
    let lookupPromises = [];
    if (!isEmpty(lookupListsToUpdate)) {
      lookupListsToUpdate.forEach((list) => {
        let propertyValue = get(this, get(list, 'property'));
        let lookupListToUpdate = get(this, get(list, 'name'));
        if (!isEmpty(propertyValue)) {
          if (!isEmpty(lookupListToUpdate) && lookupListToUpdate.then) {
            lookupPromises.push(lookupListToUpdate.then((lookupList) => {
              return this._checkListForUpdate(list, lookupList, listsToUpdate, propertyValue);
            }));
          } else {
            this._checkListForUpdate(list, lookupListToUpdate, listsToUpdate, propertyValue);
          }
        }
      });
      if (!isEmpty(lookupPromises)) {
        return RSVP.all(lookupPromises).then(() => {
          let lookupLists = get(this, 'lookupLists');
          let updatePromises = [];
          listsToUpdate.forEach((list) =>{
            updatePromises.push(list.save().then(() => {
              set(this, 'lookupListsLastUpdate', new Date().getTime());
              lookupLists.resetLookupList(get(list, 'id'));
            }));
          });
          return RSVP.all(updatePromises);
        });
      }
    }
    return RSVP.resolve();
  },

  _checkListForUpdate(listInfo, lookupList, listsToUpdate, propertyValue) {
    let store = get(this, 'store');
    if (!lookupList) {
      lookupList = store.push(store.normalize('lookup', {
        id: listInfo.id,
        value: [],
        userCanAdd: true
      }));
    }
    if (Ember.isArray(propertyValue)) {
      propertyValue.forEach(function(value) {
        this._addValueToLookupList(lookupList, value, listsToUpdate, listInfo.name);
      }.bind(this));
    } else {
      this._addValueToLookupList(lookupList, propertyValue, listsToUpdate, listInfo.name);
    }
    return lookupList;
  }

});
