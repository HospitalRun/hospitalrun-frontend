<<<<<<< HEAD
import DS from 'ember-data';
import Ember from 'ember';

const {
  isEmpty
} = Ember;

export default DS.Transform.extend({
  store: Ember.inject.service(),

  deserialize(serialized) {
    if (isEmpty(serialized)) {
      return serialized;
    }
    let customFormKeys = Object.keys(serialized);
    let deserialized = Ember.Object.create();
    customFormKeys.forEach((customFormId) => {
      deserialized.set(customFormId, Ember.Object.create(serialized[customFormId]));
    });
    return deserialized;
  },

  serialize(deserialized) {
    return deserialized;
  }
});
=======
import EmberObject from '@ember/object';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import DS from 'ember-data';

export default DS.Transform.extend({
  store: service(),

  deserialize(serialized) {
    if (isEmpty(serialized)) {
      return serialized;
    }
    let customFormKeys = Object.keys(serialized);
    let deserialized = EmberObject.create();
    customFormKeys.forEach((customFormId) => {
      deserialized.set(customFormId, EmberObject.create(serialized[customFormId]));
    });
    return deserialized;
  },

  serialize(deserialized) {
    return deserialized;
  }
});
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
