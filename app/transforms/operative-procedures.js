import { get } from '@ember/object';
import { isEmpty } from '@ember/utils';
import DS from 'ember-data';

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
