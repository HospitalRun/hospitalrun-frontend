import Ember from 'ember';
import EditPanelProps from 'hospitalrun/mixins/edit-panel-props';
import IsUpdateDisabled from 'hospitalrun/mixins/is-update-disabled';
import ModalHelper from 'hospitalrun/mixins/modal-helper';
import UserSession from 'hospitalrun/mixins/user-session';

const { get } = Ember;

export default Ember.Controller.extend(EditPanelProps, IsUpdateDisabled, ModalHelper, UserSession, {
  cancelAction: 'allItems',

  cancelButtonText: function() {
    let i18n = this.get('i18n');
    let hasDirtyAttributes = this.get('model.hasDirtyAttributes');
    if (hasDirtyAttributes) {
      return i18n.t('buttons.cancel');
    } else {
      return i18n.t('buttons.returnButton');
    }
  }.property('model.hasDirtyAttributes'),

  disabledAction: function() {
    let model = this.get('model');
    if (model.validate) {
      model.validate().catch(Ember.K);
    }
    let isValid = model.get('isValid');
    if (!isValid) {
      return 'showDisabledDialog';
    }
  }.property('model.isValid'),

  isNewOrDeleted: function() {
    return this.get('model.isNew') || this.get('model.isDeleted');
  }.property('model.isNew', 'model.isDeleted'),

  /**
   *  Lookup lists that should be updated when the model has a new value to add to the lookup list.
   *  lookupListsToUpdate: [{
   *      name: 'countryList', //Name of property containing lookup list
   *      property: 'country', //Corresponding property on model that potentially contains a new value to add to the list
   *      id: 'country_list' //Id of the lookup list to update
   *  }
   */
  lookupListsToUpdate: null,

  showUpdateButton: function() {
    let updateButtonCapability = this.get('updateCapability');
    return this.currentUserCan(updateButtonCapability);
  }.property('updateCapability'),

  updateButtonAction: 'update',
  updateButtonText: function() {
    let i18n = this.get('i18n');
    if (this.get('model.isNew')) {
      return i18n.t('buttons.add');
    } else {
      return i18n.t('buttons.update');
    }
  }.property('model.isNew'),
  updateCapability: null,

  /* Silently update and then fire the specified action. */
  silentUpdate(action, whereFrom) {
    this.beforeUpdate().then(() => {
      return this.saveModel(true);
    }).then(() => {
      this.send(action, whereFrom);
    });
  },

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
    let cancelledItem = this.get('model');
    cancelledItem.rollbackAttributes();
  },

  actions: {
    cancel() {
      this._cancelUpdate();
      this.send(this.get('cancelAction'));
    },

    returnTo() {
      this._cancelUpdate();
      let returnTo = this.get('model.returnTo');
      let returnToContext = this.get('model.returnToContext');
      if (Ember.isEmpty(returnToContext)) {
        this.transitionToRoute(returnTo);
      } else {
        this.transitionToRoute(returnTo, returnToContext);
      }
    },

    showDisabledDialog() {
      let i18n = this.get('i18n');
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
      try {
        this.beforeUpdate().then(() => {
          this.saveModel(skipAfterUpdate);
        }).catch((err) => {
          if (!err.ignore) {
            let i18n = this.get('i18n');
            this.displayAlert(
              i18n.t('alerts.errorExclamation'),
              i18n.t('messages.saveActionException', { message: JSON.stringify(err) })
            );
          }
        });
      } catch(ex) {
        let i18n = this.get('i18n');
        this.displayAlert(
          i18n.t('alerts.errorExclamation'),
          i18n.t('messages.saveActionException', { message: JSON.stringify(ex) })
        );
      }
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
      this.updateLookupLists();
      if (!skipAfterUpdate) {
        this.afterUpdate(record);
      }
    }).catch((error) => {
      this.send('error', error);
    });
  },

  /**
   * Update any new values added to a lookup list
   */
  updateLookupLists() {
    let lookupLists = this.get('lookupListsToUpdate');
    let listsToUpdate = Ember.A();
    if (!Ember.isEmpty(lookupLists)) {
      lookupLists.forEach(function(list) {
        let propertyValue = this.get(list.property);
        let lookupList = this.get(list.name);
        let store = this.get('store');
        if (!Ember.isEmpty(propertyValue)) {
          if (!lookupList) {
            lookupList = store.push(store.normalize('lookup', {
              id: list.id,
              value: [],
              userCanAdd: true
            }));
          }
          if (Ember.isArray(propertyValue)) {
            propertyValue.forEach(function(value) {
              this._addValueToLookupList(lookupList, value, listsToUpdate, list.name);
            }.bind(this));
          } else {
            this._addValueToLookupList(lookupList, propertyValue, listsToUpdate, list.name);
          }
        }
      }.bind(this));
      listsToUpdate.forEach(function(list) {
        list.save();
      });
    }
  }

});
