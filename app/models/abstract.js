import DS from 'ember-data';
import Ember from 'ember';
import EmberValidations from 'ember-validations';
import { Model } from 'ember-pouch';
import UserSession from 'hospitalrun/mixins/user-session';
export default Model.extend(UserSession, EmberValidations, {
  session: Ember.inject.service(),
  archived: DS.attr('boolean'),
  lastModified: DS.attr('date'),
  modifiedBy: DS.attr(),
  modifiedFields: DS.attr(),

  /**
  * Before saving the record, update the modifiedFields attribute to denote what fields were changed when.
  * Also, if the save failed because of a conflict, reload the record and reapply the changed attributes and
  * attempt to save again.
  */
  save: function(options) {
    let attribute;
    let changedAttributes = this.changedAttributes();
    let modifiedDate = new Date();
    let modifiedFields = this.get('modifiedFields');
    let session = this.get('session');

    if (!session || !session.get('isAuthenticated')) {
      return new Ember.RSVP.Promise(function(resolve, reject) {
        Ember.run(null, reject, 'ERROR you must be logged in to save');
      });
    }

    if (this.get('hasDirtyAttributes') && !this.get('isDeleted')) {
      if (Ember.isEmpty(modifiedFields)) {
        modifiedFields = {};
      }
      this.set('lastModified', modifiedDate);
      for (attribute in changedAttributes) {
        modifiedFields[attribute] = modifiedDate;
      }
      this.set('modifiedFields', modifiedFields);
      this.set('modifiedBy', this.getUserName());
    }
    return this._super(options).catch(function(error) {
      if (!Ember.isEmpty(options) && options.retry) {
        throw error;
      } else {
        if (error.name && error.name.indexOf && error.name.indexOf('conflict') > -1) {
          // Conflict encountered, so rollback, reload and then save the record with the changed attributes.
          this.rollbackAttributes();
          return this.reload().then(function(record) {
            for (let attribute in changedAttributes) {
              record.set(attribute, changedAttributes[attribute][1]);
            }
            if (Ember.isEmpty(options)) {
              options = {};
            }
            options.retry = true;
            return record.save(options);
          });
        } else {
          throw error;
        }
      }
    }.bind(this));
  }
});
