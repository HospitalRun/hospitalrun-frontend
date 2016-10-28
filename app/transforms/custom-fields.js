import DS from 'ember-data';
import Ember from 'ember';

export default DS.Transform.extend({
  deserialize(serialized) {
    return serialized.map((customField) => {
      let deserialized = Ember.Object.create(customField);
      return deserialized;
    });
  },

  serialize(deserialized) {
    return deserialized;
  }
});
