import AbstractModel from "hospitalrun/models/abstract";

export default AbstractModel.extend({
   type: DS.attr('string'),
   component: DS.attr('string'),
   userValue: DS.attr('string')

});
