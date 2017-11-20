import { inject as service } from '@ember/service';
import { get } from '@ember/object';
import { isEmpty } from '@ember/utils';
import DS from 'ember-data';
import uuid from 'npm:uuid';

export default DS.Transform.extend({
  store: service(),

  deserialize(serialized) {
    if (isEmpty(serialized)) {
      return serialized;
    }
    return serialized.map((customField) => {
      let store = this.get('store');
      let record = store.push({
        data: {
          id: uuid.v4(),
          type: 'custom-field',
          attributes: customField
        }
      });
      return record;
    });
  },

  serialize(deserialized) {
    if (isEmpty(deserialized)) {
      return deserialized;
    }
    let serializedField = deserialized.map((customField) => {
      let serializedValue = customField.serialize();
      let deserializedValues = customField.get('values');
      if (!isEmpty(deserializedValues)) {
        let serializedValues = deserializedValues.map((value) => {
          let property = get(value, 'property');
          let serializedValue = {
            label: get(value, 'label')
          };
          if (!isEmpty(property)) {
            serializedValue.property = property;
          }
          return serializedValue;
        });
        serializedValue.values = serializedValues;
      }
      return serializedValue;
    });
    return serializedField;
  }
});
