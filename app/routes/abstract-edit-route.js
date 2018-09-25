import { isEmpty } from '@ember/utils';
import { Promise as EmberPromise, resolve } from 'rsvp';
import Route from '@ember/routing/route';
import { get, computed } from '@ember/object';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Route.extend(AuthenticatedRouteMixin, {
  editTitle: null,
  hideNewButton: false,
  modelName: null,
  newTitle: null,

  _createNewRecord(params) {
    return new EmberPromise(function(resolve) {
      this.generateId().then(function(newId) {
        this.getNewData(params).then(function(data) {
          let modelName = get(this, 'modelName');
          if (newId) {
            data.id = newId;
          }
          if (newId && this.store.hasRecordForId(modelName, newId)) {
            resolve(this.store.push(this.store.normalize(modelName, data)));
          } else {
            resolve(this.store.createRecord(modelName, data));
          }
        }.bind(this));
      }.bind(this));
    }.bind(this));
  },

  idParam: computed('modelName', function() {
    let modelName = get(this, 'modelName');
    return `${modelName}_id`;
  }),

  /**
   * Override this function to generate an id for a new record
   * @return a promise that will resolved to a generated id;default is null which means that an
   * id will be automatically generated via Ember data.
   */
  generateId() {
    return resolve(null);
  },

  /**
   * Override this function to define what data a new model should be instantiated with.
   * @return a promise that will resolve with the data for a new record; defaults to empty object.
   */
  getNewData() {
    return resolve({});
  },

  getScreenTitle(model) {
    if (get(model, 'isNew')) {
      return get(this, 'newTitle');
    } else {
      return get(this, 'editTitle');
    }
  },

  model(params) {
    let idParam = get(this, 'idParam');
    if (!isEmpty(idParam) && params[idParam] === 'new') {
      return this._createNewRecord(params);
    } else {
      return this._super(params);
    }
  },

  setupController(controller, model) {
    let sectionDetails = {};
    sectionDetails.currentScreenTitle = this.getScreenTitle(model);
    if (get(this, 'hideNewButton')) {
      sectionDetails.newButtonAction = null;
    }
    this.send('setSectionHeader', sectionDetails);
    this._super(controller, model);
  }
});
