import AbstractModel from 'hospitalrun/models/abstract';
import DS from 'ember-data';

export default AbstractModel.extend({
  // Attributes
  price: DS.attr('number'),

  // Associations
  profile: DS.belongsTo('price-profile', { async: false }),

  validations: {
    profile: {
      presence: true
    },
    price: {
      numericality: true
    }
  }
});
