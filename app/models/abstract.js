import { inject as service } from '@ember/service';
import { run } from '@ember/runloop';
import { Promise as EmberPromise } from 'rsvp';
import { get } from '@ember/object';
import { isEmpty } from '@ember/utils';
import DS from 'ember-data';
import EmberValidations from 'ember-validations';
import { Model } from 'ember-pouch';
import UserSession from 'hospitalrun/mixins/user-session';

export default Model.extend(UserSession, EmberValidations, {
  session: service(),
  archived: DS.attr('boolean', { defaultValue: false }),
  lastModified: DS.attr('date'),
  modifiedBy: DS.attr(),
  modifiedFields: DS.attr(),

  loadedCustomForms: null,

  didLoad() {
    let loadedCustomForms = this.get('customForms');
    if (!isEmpty(loadedCustomForms)) {
      loadedCustomForms = JSON.parse(JSON.stringify(loadedCustomForms));
    }
    this.set('loadedCustomForms', loadedCustomForms);
  },

  changedAttributes() {
    let changedAttributes = this._super();
    let currentCustomForms = this.get('customForms');
    let loadedCustomForms = this.get('loadedCustomForms');
    if (!isEmpty(currentCustomForms)) {
      if (isEmpty(loadedCustomForms)) {
        loadedCustomForms = {};
      }
      let newKeys = Object.keys(currentCustomForms);
      newKeys.forEach((customFormId) =>  {
        let oldCustomForm = loadedCustomForms[customFormId];
        let customFormPrefix = `customForms.${customFormId}`;
        if (isEmpty(oldCustomForm)) {
          oldCustomForm = {};
        }
        let newForm = get(currentCustomForms, customFormId);
        let newFormKeys = Object.keys(newForm);
        newFormKeys.forEach((newFormProperty) => {
          let oldValue = get(oldCustomForm, newFormProperty);
          let newValue = get(newForm, newFormProperty);
          if (oldValue != newValue) {
            changedAttributes[`${customFormPrefix}.${newFormProperty}`] = [oldValue, newValue];
          }
        });
      });
    }
    return changedAttributes;
  },

  /**
  * Before saving the record, update the modifiedFields attribute to denote what fields were changed when.
  * Also, if the save failed because of a conflict, reload the record and reapply the changed attributes and
  * attempt to save again.
  */
  save(options) {
    let attribute;
    let changedAttributes = this.changedAttributes();
    let modifiedDate = new Date();
    let modifiedFields = this.get('modifiedFields');
    let session = this.get('session');

    if (!session || !session.get('isAuthenticated')) {
      return new EmberPromise(function(resolve, reject) {
        run(null, reject, 'ERROR you must be logged in to save');
      });
    }

    if (this.get('hasDirtyAttributes') && !this.get('isDeleted')) {
      if (isEmpty(modifiedFields)) {
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
      if (!isEmpty(options) && options.retry) {
        throw error;
      } else {
        if (error.name && error.name.indexOf && error.name.indexOf('conflict') > -1) {
          // Conflict encountered, so rollback, reload and then save the record with the changed attributes.
          this.rollbackAttributes();
          return this.reload().then(function(record) {
            for (let attribute in changedAttributes) {
              record.set(attribute, changedAttributes[attribute][1]);
            }
            if (isEmpty(options)) {
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
