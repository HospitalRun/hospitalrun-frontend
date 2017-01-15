import DS from 'ember-data';
import Ember from 'ember';

const {
  get,
  isEmpty
} = Ember;

export default DS.Transform.extend({

  deserialize(serialized) {
    if (isEmpty(serialized)) {
      return [];
    }
    return serialized.map((description) => {
      return {
        description
      };
    });
  },

  serialize(deserialized) {
    if (isEmpty(deserialized)) {
      return [];
    }
    return deserialized.map((procedure) => {
      return get(procedure, 'description');
    });
  }

});
