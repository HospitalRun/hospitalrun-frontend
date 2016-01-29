import AbstractModel from 'hospitalrun/models/abstract';
import DS from 'ember-data';

export default AbstractModel.extend({
  profile: DS.belongsTo('price-profile', {
    async: false
  }),
  price: DS.attr('number'),
  validations: {
    profile: {
      presence: true
    },
    price: {
      numericality: true
    }
  }
});
