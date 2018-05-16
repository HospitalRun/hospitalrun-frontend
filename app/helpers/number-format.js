<<<<<<< HEAD
import Ember from 'ember';
import NumberFormat from 'hospitalrun/mixins/number-format';

let NumberHandler = Ember.Object.extend(NumberFormat);
export default Ember.Helper.helper(function([number]) {
  let numberHandler = new NumberHandler();
  return numberHandler._numberFormat(number);
});
=======
import { helper } from '@ember/component/helper';
import EmberObject from '@ember/object';
import NumberFormat from 'hospitalrun/mixins/number-format';

let NumberHandler = EmberObject.extend(NumberFormat);
export default helper(function([number]) {
  let numberHandler = new NumberHandler();
  return numberHandler._numberFormat(number);
});
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
