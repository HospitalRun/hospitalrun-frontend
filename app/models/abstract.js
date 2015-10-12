import DS from 'ember-data';
import Ember from 'ember';
import EmberValidations from 'ember-validations';
import { Model } from 'ember-pouch';
import UserSession from 'hospitalrun/mixins/user-session';
export default Model.extend(UserSession, EmberValidations, {
  lastModified: DS.attr('date'),
  modifiedBy: DS.attr(),
  modifiedFields: DS.attr(),

  /**
  * Before saving the record, update the modifiedFields attribute to denote what fields were changed when.
  * Also, if the save failed because of a conflict, reload the record and reapply the changed attributes and
  * attempt to save again.
  */
  save: function(options) {
    var attribute,
      changedAttributes = this.changedAttributes(),
      modifiedDate = new Date(),
      modifiedFields = this.get('modifiedFields'),
      session = this.get('session');

    if (!session || !session.isAuthenticated) {
      return new Ember.RSVP.Promise(function(resolve, reject) {
        Ember.run(null, reject, 'ERROR you must be logged in to save');
      });
    }

    if (this.get('isDirty') && !this.get('isDeleted')) {
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

    return new Ember.RSVP.Promise(function(resolve, reject) {
      this._super(options).then(function(results) {
        Ember.run(null, resolve, results);
      }, function(error) {
        if (!Ember.isEmpty(options) && options.retry) {
          // We failed on the second attempt to save the record, so reject the save.
          Ember.run(null, reject, error);
        } else {
          if (error.indexOf && error.indexOf('conflict') > -1) {
            // Conflict encountered, so rollback, reload and then save the record with the changed attributes.
            this.rollback();
            this.reload().then(function(record) {
              for (var attribute in changedAttributes) {
                record.set(attribute, changedAttributes[attribute][1]);
              }
              options.retry = true;
              record.save(options).then(function(results) {
                Ember.run(null, resolve, results);
              }, function(err) {
                Ember.run(null, reject, err);
              });

            }, function(err) {
              Ember.run(null, reject, err);
            });
          } else {
            Ember.run(null, reject, error);
          }
        }
      }.bind(this));
    }.bind(this));
  }
});
