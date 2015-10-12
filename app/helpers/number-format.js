import Ember from 'ember';
import NumberFormat from 'hospitalrun/mixins/number-format';

var NumberHandler = Ember.Object.extend(NumberFormat);
export default Ember.Handlebars.makeBoundHelper(function(number) {
  var numberHandler = new NumberHandler();
  return numberHandler._numberFormat(number);
});
