import Ember from 'ember';
import EditPanelProps from 'hospitalrun/mixins/edit-panel-props';
import IsUpdateDisabled from 'hospitalrun/mixins/is-update-disabled';
import ModalHelper from 'hospitalrun/mixins/modal-helper';
import UserSession from 'hospitalrun/mixins/user-session';
export default Ember.Controller.extend(EditPanelProps, IsUpdateDisabled, ModalHelper, UserSession, {
  cancelAction: 'allItems',

  cancelButtonText: function() {
    let i18n = this.get('i18n');
    var hasDirtyAttributes = this.get('model.hasDirtyAttributes');
    if (hasDirtyAttributes) {
      return i18n.t('buttons.cancel');
    } else {
      return i18n.t('buttons.return_button');
    }
  }.property('model.hasDirtyAttributes'),

  disabledAction: function() {
    var isValid = this.get('model.isValid');
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
    var updateButtonCapability = this.get('updateCapability');
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

  /**
   * Add the specified value to the lookup list if it doesn't already exist in the list.
   * @param lookupList array the lookup list to add to.
   * @param value string the value to add.
   * @param listsToUpdate array the lookup lists that need to be saved.
   * @param listsName string name of the list to add the value to.
   */
  _addValueToLookupList: function(lookupList, value, listsToUpdate, listName) {
    var lookupListValues = lookupList.get('value');
    if (!Ember.isArray(lookupListValues)) {
      lookupListValues = [];
    }
    if (!lookupListValues.contains(value)) {
      lookupListValues.push(value);
      lookupListValues.sort();
      lookupList.set('value', lookupListValues);
      if (!listsToUpdate.contains(lookupList)) {
        listsToUpdate.push(lookupList);
      }
      this.set(listName, lookupList);
    }
  },

  _cancelUpdate: function() {
    var cancelledItem = this.get('model');
    cancelledItem.rollbackAttributes();
  },

  actions: {
    cancel: function() {
      this._cancelUpdate();
      this.send(this.get('cancelAction'));
    },

    returnTo: function() {
      this._cancelUpdate();
      var returnTo = this.get('model.returnTo'),
        returnToContext = this.get('model.returnToContext');
      if (Ember.isEmpty(returnToContext)) {
        this.transitionToRoute(returnTo);
      } else {
        this.transitionToRoute(returnTo, returnToContext);
      }
    },

    showDisabledDialog: function() {
      this.displayAlert('Warning!!!!', 'Please fill in required fields (marked with *) and correct the errors before saving.');
    },

    /**
     * Update the model and perform the before update and after update
     * @param skipAfterUpdate boolean (optional) indicating whether or not
     * to skip the afterUpdate call.
     */
    update: function(skipAfterUpdate) {
      try {
        this.beforeUpdate().then(() => {
          this.saveModel(skipAfterUpdate);
        }).catch((err) => {
          this.displayAlert('Error!!!!', 'An error occurred while attempting to save: ' + JSON.stringify(err));
        });
      } catch (ex) {
        this.displayAlert('Error!!!!', 'An error occurred while attempting to save: ' + ex);
      }
    }
  },

  /**
   * Override this function to perform logic after record update
   * @param record the record that was just updated.
   */
  afterUpdate: function() {},

  /**
   * Override this function to perform logic before record update.
   * @returns {Promise} Promise that resolves after before update is done.
   */
  beforeUpdate: function() {
    return Ember.RSVP.Promise.resolve();
  },

  /**
   * Save the model and then (optionally) run the after update.
   * @param skipAfterUpdate boolean (optional) indicating whether or not
   * to skip the afterUpdate call.
   */
  saveModel: function(skipAfterUpdate) {
    this.get('model').save().then(function(record) {
      this.updateLookupLists();
      if (!skipAfterUpdate) {
        this.afterUpdate(record);
      }
    }.bind(this));
  },

  /**
   * Update any new values added to a lookup list
   */
  updateLookupLists: function() {
    var lookupLists = this.get('lookupListsToUpdate'),
      listsToUpdate = Ember.A();
    if (!Ember.isEmpty(lookupLists)) {
      lookupLists.forEach(function(list) {
        var propertyValue = this.get(list.property),
          lookupList = this.get(list.name),
          store = this.get('store');
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
