
import AbstractModel from 'hospitalrun/models/abstract';

export default AbstractModel.extend({
    profile: DS.belongsTo('price-profile'),
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