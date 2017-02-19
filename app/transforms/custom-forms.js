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
